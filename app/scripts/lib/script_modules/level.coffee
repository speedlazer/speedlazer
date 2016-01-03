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

      options = _.defaults({}, settings.options,
        synchronizer: synchronizer
      )
      settings = _.defaults(settings,
        amount: 1
        delay: 1000
      )
      settings.options = options
      scripts = (for i in [0...settings.amount]
        synchronizer.registerEntity(new scriptClass(@level))
      )
      loadingAssets = WhenJS(true)

      if scripts[0]?.assets?
        loadingAssets = scripts[0].assets()(sequence)

      loadingAssets.then =>
        promises = (for script, i in scripts
          do (script, i) =>
            @wait(i * settings.delay)(sequence).then =>
              @_verify(sequence)
              script.run(settings.options)
        )
        WhenJS.all(promises).then (results) =>
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

          if allKilled
            lastLocation.x -= Crafty.viewport.x
            lastLocation.y -= Crafty.viewport.y
            if settings.drop
              @drop(item: settings.drop, location: lastLocation)(sequence)

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
      item = @inventory('item', options.item)
      if player = options.inFrontOf
        @level.addComponent item().attr(z: -1), x: 640, y: player.ship().y
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
  waitForScenery: (sceneryType, options = { event: 'enter' }) ->
    (sequence) =>
      @_verify(sequence)
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
      duration = 1 if @_skippingToCheckpoint()
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
  setSpeed: (speed) ->
    (sequence) =>
      @_verify(sequence)
      @level.setForcedSpeed speed

  # Show the scores of the players active in the game
  # This is used to end a stage in the game
  showScore: (stage, title) ->
    (sequence) =>
      @_verify(sequence)
      score = Crafty.e('StageEnd').stageEnd(@level, stage, title)
      @wait(15 * 2000)(sequence).then =>
        score.destroy()

  disableWeapons: ->
    (sequence) =>
      @_verify(sequence)
      @level.setWeaponsEnabled no

  enableWeapons: ->
    (sequence) =>
      @_verify(sequence)
      @level.setWeaponsEnabled yes

  explosion: (location, options = { damage: 0, radius: 20 }) ->
    (sequence) =>
      @_verify(sequence)
      { x, y } = location()
      x -= Crafty.viewport.x
      y -= Crafty.viewport.y

      e = Crafty.e('Explosion').explode(
        x: x
        y: y
        radius: options.radius
        damage: options.damage
      )
      if options.damage
        e.addComponent('Enemy')


  loadAssets: (assetObject) ->
    (sequence) =>
      d = WhenJS.defer()
      Crafty.load(assetObject, (-> d.resolve()))
      d.promise

  updateTitle: (text) ->
    (sequence) =>
      @_verify(sequence)
      @level.updateTitle(text)
