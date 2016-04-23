Game = @Game
Game.ScriptModule ?= {}

# Actions to control the flow of a level
#
# - placeSquad
# - say
# - drop
# - player
# - setScenery
# - waitForScenery
# - gainHeight
# - setSpeed
# - showScore
# - disableWeapons
# - enableWeapons
# - explosion
# - pickTarget
# - targetLocation
#
Game.ScriptModule.Level =
  # Place a set of multiple enemies.
  #
  # It starts multiple 'entityScripts' in parallel, but
  # keeps trackins state of the scripts. When the scripts reject
  # (which means the enemies are killed) it can drop an item
  # on the location of the last killed enemy (if ALL enemies of
  # the squad are killed).
  #
  # @param scriptClass: The entity script to start for each enemy
  # @param settings (optional)
  #
  # settings supported:
  # - amount: total amount of enemies to spawn (default: 1)
  # - delay: amount of ms between spawning (default: 1000)
  # - options: options to pass to each enemy in the squad
  #
  placeSquad: (scriptClass, settings = {}) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      synchronizer = new Game.Synchronizer
      settings = _.clone settings

      options = _.defaults({
        synchronizer: synchronizer
      }, settings.options)
      settings = _.defaults({}, settings,
        amount: 1
        delay: 1000
      )
      if options.gridConfig?
        options.grid = new Game.LocationGrid(options.gridConfig)
      settings.options = options
      scripts = (for i in [0...settings.amount]
        synchronizer.registerEntity(new scriptClass(@level))
      )
      loadingAssets = WhenJS(true)

      if scripts[0]?.assets?
        loadingAssets = scripts[0].assets(_.clone(settings.options))(sequence)

      loadingAssets.then =>
        promises = (for script, i in scripts
          do (script, i) =>
            @wait(i * settings.delay)(sequence).then =>
              @_verify(sequence)
              s = _.clone(settings.options)
              s.index = i
              script.run(s)
        )
        WhenJS.all(promises).then (results) =>
          @attackWaveResults = (@attackWaveResults || []).concat(results)

          allKilled = yes
          lastLocation = null
          lastKilled = null
          for { alive, killedAt, location } in results
            if alive
              allKilled = no
            else
              lastKilled ?= killedAt
              lastLocation ?= location
              if killedAt.getTime() > lastKilled.getTime()
                lastKilled = killedAt
                lastLocation = location

          if allKilled and lastLocation
            lastLocation.x -= Crafty.viewport.x
            lastLocation.y -= Crafty.viewport.y
            if settings.drop
              @drop(item: settings.drop, location: lastLocation)(sequence)

  attackWaves: (promise, settings = {}) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      @attackWaveResults = []

      promise(sequence).then =>

        allKilled = yes
        lastLocation = null
        lastKilled = null
        for { alive, killedAt, location } in @attackWaveResults
          if alive
            allKilled = no
          else
            lastKilled ?= killedAt
            lastLocation ?= location
            if killedAt.getTime() > lastKilled.getTime()
              lastKilled = killedAt
              lastLocation = location

        if allKilled and lastLocation
          lastLocation.x += Crafty.viewport.x
          lastLocation.y += Crafty.viewport.y
          if settings.drop
            @drop(item: settings.drop, location: -> lastLocation)(sequence)

  # Show dialog at the bottom of the screen
  # The duration in screen depends on the amount of lines in the
  # text param
  #
  # @param speaker: the speaker of the text
  # @param text: the text to display. This can be multiple lines (\n as seperator)
  #
  say: (speaker, text) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      unless text?
        text = speaker
        speaker = undefined
      Game.say(speaker, text, bottom: @level.visibleHeight)

  # Drop an item in the screen at a given location,
  #
  # options:
  # - item: name of the item. The item will be pulled from the level's inventory
  # - inFrontOf: place the item just out of screen at the height of a given location
  # - location: place the item at the given location
  #
  # example:
  #
  # @drop item: 'lasers', inFrontOf: @player(1)
  #
  # @drop item: 'lasers', location: @location()
  # @drop item: 'lasers', location: { x: 123, y: 123 }
  #
  drop: (options) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      itemSettings = @inventory(options.item)
      item = -> Crafty.e('PowerUp').powerUp(itemSettings)
      unless item
        console.warn 'Item ', options.item, ' is not known'
        return WhenJS()
      if player = options.inFrontOf
        ship = player.ship()
        if ship
          @level.addComponent item().attr(z: -1), x: Crafty.viewport.width, y: player.ship().y + Crafty.viewport.y
        else
          unless player.gameOver
            d = WhenJS.defer()
            player.entity.one 'ShipSpawned', (ship) =>
              @level.addComponent item().attr(z: -1), x: Crafty.viewport.width, y: ship.y + Crafty.viewport.y
              d.resolve()
            return d.promise

      if pos = options.location
        coords = pos?()
        # coords from a function are always relative
        # to the viewport.
        if coords
          coords.x -= Crafty.viewport.x
          coords.y -= Crafty.viewport.y
        else
          coords = pos

        item().attr(x: coords.x, y: coords.y, z: -1)

  # Returns an object with information about a player
  #
  # @player(1)
  #  .name : name of the player
  #  .active : is the player active in the game
  #  .gameOver : has the player used all of its lives
  #  .ship() : Reference to the ship of the player
  #  .has(name) : Checking method if the ship has certain upgrades
  player: (nr) ->
    players = {}
    Crafty('Player').each ->
      players[@name] =
        name: @name
        entity: this
        active: no
        gameOver: no
        has: (item) ->
          @ship()?.hasItem item
        ship: ->
          _this = this
          ship = null
          Crafty('Player ControlScheme').each ->
            ship = @ship if @name is _this.name
          ship

    Crafty('Player ControlScheme').each ->
      players[@name].active = yes
      unless @lives > 0
        players[@name].active = no
        players[@name].gameOver = yes

    players["Player #{nr}"]

  # Change the upcoming scenery.
  # Note that this scenery will be started out of screen,
  # and can take a while before it is fully in screen.
  #
  # @see `waitForScenery`
  setScenery: (scenery) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      @level.setScenery scenery

  # Supported eventTypes:
  # - enter (default) -- The scenery is about to enter the screen
  # - leave           -- The scenery has just left the screen
  # - inScreen        -- The scenery is at the left side of the screen (about to move out)
  # - outScreen       -- The scenery's end is at the right side of the screen (about to move out)
  # - playerLeave     -- The player is leaving the scenery
  # - playerEnter     -- The player is entering the scenery
  waitForScenery: (sceneryType, options = {}) ->
    (sequence) =>
      @_verify(sequence)
      options = _.defaults(options,
        event: 'enter'
      )
      return WhenJS() if @_skippingToCheckpoint()
      d = WhenJS.defer()
      @level.notifyScenery options.event, sceneryType, -> d.resolve()
      d.promise

  # Move the screen upwards or downwards
  #
  # height: amount of pixels to gain/lose
  # options:
  # - duration : duration in ms to reach the new altitude
  gainHeight: (height, options) ->
    (sequence) =>
      @_verify(sequence)
      d = WhenJS.defer()

      currentSpeed = @level._forcedSpeed?.x || @level._forcedSpeed
      { duration } = options
      if @_skippingToCheckpoint() or duration is 0
        @level.setHeight -height
      else
        speedY = (height / duration) * 1000

        @level.setForcedSpeed(x: currentSpeed, y: -speedY)
        level = @level
        Crafty.e('Delay').delay(
          ->
            level.setForcedSpeed(currentSpeed)
            d.resolve()
          duration
        )
        d.promise

  # Change the speed of the camera and the playerships.
  #
  # speed: the speed in px/sec
  setSpeed: (speed, options = {}) ->
    (sequence) =>
      @_verify(sequence)
      options = _.defaults(options,
        accellerate: yes
      )
      @level.setForcedSpeed speed, options

  # Show the scores of the players active in the game
  # This is used to end a stage in the game
  showScore: (stage, title) ->
    (sequence) =>
      @_verify(sequence)
      score = Crafty.e('StageEnd').stageEnd(@level, stage, title)
      @wait(15 * 2000)(sequence).then =>
        score.destroy()

  disableWeapons: (players...) ->
    (sequence) =>
      @_verify(sequence)
      @level.setWeaponsEnabled no, players

  enableWeapons: (players...) ->
    (sequence) =>
      @_verify(sequence)
      @level.setWeaponsEnabled yes, players

  blast: (location, options = {}, frameOptions) ->
    (sequence) =>
      @_verify(sequence)
      { x, y } = location()
      x -= Crafty.viewport.x
      y -= Crafty.viewport.y
      options = options?() ? options
      options = _.defaults(
        { x, y }
        options
        {
          damage: 0
          radius: 20
          duration: 160
          z: 5
          topDesaturation: 0
          bottomDesaturation: 0
          lightness: 1.0
          alpha: 1.0
        }
      )

      e = Crafty.e('Blast, Explosion').explode(
        options,
        frameOptions
      )
      if y > @_getSeaLevel() - 60 and options.lightness is 1.0
        e.addComponent('WaterSplashes')
        e.attr waterSplashSpeed: 500
        e.setDetectionOffset 40, 0
        e.setSealevel(@_getSeaLevel())

      if options.damage
        e.addComponent('Enemy')

  loadAssets: (names...) ->
    (sequence) =>
      @level.loadAssets(names)

  updateTitle: (text) ->
    (sequence) =>
      @_verify(sequence)
      Crafty('LevelTitle').text text

  chapterTitle: (number, text) ->
    (sequence) =>
      @_verify(sequence)
      Crafty('LevelTitle').text "#{number}: #{text}"
      return WhenJS() if @_skippingToCheckpoint()
      Crafty.e('BigText').bigText(text, super: "Chapter #{number}:")

  showText: (text, options = {}) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      Crafty.e('BigText').bigText(text, options)

  pickTarget: (selection) ->
    (sequence) =>
      pickTarget = (selection) ->
        entities = Crafty(selection)
        return null if entities.length is 0
        entities.get Math.floor(Math.random() * entities.length)

      # TODO: When this script is done, unbind events
      refreshTarget = (ship) =>
        @target = { x: ship.x, y: ship.y }
        Crafty.one 'ShipSpawned', (ship) =>
          @target = pickTarget(selection)
          @target.one 'Destroyed', refreshTarget

      @target = pickTarget(selection)

      if selection is 'PlayerControlledShip' and @target
        @target.one 'Destroyed', refreshTarget

  targetLocation: (override = {}) ->
    =>
      if override.x? and (-1 < override.x < 2)
        override.x *= Crafty.viewport.width
      if override.y? and (-1 < override.y < 2)
        override.y *= Crafty.viewport.height

      hasX = (override.x or @target?.x)
      hasY = (override.y or @target?.y)
      return null unless hasX and hasY

      x: (override.x ? (@target.x + Crafty.viewport.x)) + (override.offsetX ? 0)
      y: (override.y ? (@target.y + Crafty.viewport.y)) + (override.offsetY ? 0)

  changeSeaLevel: (offsetY) ->
    (sequence) =>
      @_verify(sequence)
      @level.sealevelOffset = offsetY

  screenShake: (amount, options = {}) ->
    (sequence) =>
      @_verify(sequence)
      options = _.defaults(options, {
        duration: 1000
      })
      @level.screenShake(amount, options)
      @wait(options.duration)(sequence)

   moveCamera: (settings = {}) ->
     (sequence) =>
       # TODO: Figure out skipping
       @level.cameraPan(settings)
       @wait(settings.duration)(sequence)

  setWeapons: (newWeapons) ->
    (sequence) =>
      @_verify(sequence)
      Crafty('PlayerControlledShip').each ->
        @clearItems()
        for item in newWeapons
          itemSettings = @inventory(item)
          @installItem itemSettings
      @level.setStartWeapons newWeapons

  hideHud: (settings = {}) ->
    settings = _.defaults(settings,
      visible: no
    )
    @toggleHud(settings)

  showHud: (settings = {}) ->
    settings = _.defaults(settings,
      visible: yes
    )
    @toggleHud(settings)

  toggleHud: (settings = {}) ->
    (sequence) =>
      @_verify(sequence)
      settings = _.defaults(settings,
        duration: 1000
      )
      Crafty('HUD').each ->
        @addComponent('Tween')
        @tween(
          alpha: if settings.visible then 1.0 else 0.0
          settings.duration
        )
      @wait(settings.duration)(sequence)

  setShipType: (newType) ->
    (sequence) =>
      @_verify(sequence)
      @level.setShipType newType

  endGame: ->
    (sequence) =>
      @_verify(sequence)
      @gotoGameOver = yes

  disableControls: ->
    (sequence) =>
      @_verify(sequence)
      Crafty('PlayerControlledShip').each -> @disableControl()

  screenFadeOut: ->
    (sequence) =>
      @_verify(sequence)
      fader = Crafty('ScreenFader').get(0)
      unless fader?
        fader = Crafty.e('2D, DOM, Color, HUD, Tween, ScreenFader')

      defer = WhenJS.defer()

      fader.positionHud(
        x: 0,
        y: 0,
        z: 1000
      ).attr(
        w: Crafty.viewport.width
        h: Crafty.viewport.height
        alpha: 0
      ).color(
        '#000000'
      ).tween(
        alpha: 1
        4000
      ).bind('TweenEnd', ->
        defer.resolve()
      )

      defer.promise

  screenFadeIn: ->
    (sequence) =>
      @_verify(sequence)
      fader = Crafty('ScreenFader').get(0)
      unless fader?
        fader = Crafty.e('2D, DOM, Color, HUD, Tween, ScreenFader')

      defer = WhenJS.defer()

      fader.positionHud(
        x: 0,
        y: 0,
        z: 1000
      ).attr(
        w: Crafty.viewport.width
        h: Crafty.viewport.height
        alpha: 1
      ).color(
        '#000000'
      ).tween(
        alpha: 0
        4000
      ).bind('TweenEnd', ->
        @destroy()
        defer.resolve()
      )

      defer.promise



