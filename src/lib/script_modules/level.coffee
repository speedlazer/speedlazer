clone = require('lodash/clone')
sample = require('lodash/sample')
shuffle = require('lodash/shuffle')
defaults = require('lodash/defaults')
Synchronizer = require('src/lib/Synchronizer').default
LocationGrid = require('src/lib/LocationGrid').default
say = require('src/lib/Dialog').say
{ setGameSpeed } = require("src/lib/core/gameSpeed")

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
# - disableWeapons
# - enableWeapons
# - explosion
# - pickTarget
# - targetLocation
#
Level =
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
      return Promise.resolve() if @_skippingToCheckpoint()
      synchronizer = new Synchronizer
      settings = clone settings

      options = defaults({
        synchronizer: synchronizer
      }, settings.options)
      settings = defaults({}, settings,
        amount: 1
        delay: 1000
      )
      if options.gridConfig?
        options.grid = new LocationGrid(options.gridConfig)
      settings.options = options
      scripts = (for i in [0...settings.amount]
        synchronizer.registerEntity(new scriptClass(@level))
      )
      loadingAssets = Promise.resolve()

      if scripts[0]?.assets?
        loadingAssets = scripts[0].assets(clone(settings.options))(sequence)

      loadingAssets.then =>
        promises = scripts.map((script, i) =>
          @wait(i * settings.delay)(sequence).then =>
            @_verify(sequence)
            s = clone(settings.options)
            s.index = i
            return script.run(s)
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
            dropLocation = {
              x: lastLocation.x - Crafty.viewport.x
              y: lastLocation.y - Crafty.viewport.y
            }
            if settings.drop
              @drop(item: settings.drop, location: dropLocation)(sequence)

  attackWaves: (promise, settings = {}) ->
    (sequence) =>
      @_verify(sequence)
      return Promise.resolve() if @_skippingToCheckpoint()
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
          dropLocation = {
            x: lastLocation.x - Crafty.viewport.x
            y: lastLocation.y - Crafty.viewport.y
          }
          if settings.drop
            @drop(item: settings.drop, location: dropLocation)(sequence)

  # Show dialog at the bottom of the screen
  # The duration in screen depends on the amount of lines in the
  # text param
  #
  # @param speaker: the speaker of the text
  # @param text: the text to display. This can be multiple lines (\n as seperator)
  #
  say: (speaker, text, options = {}) ->
    (sequence) =>
      @_verify(sequence)
      return Promise.resolve() if @_skippingToCheckpoint()
      unless text?
        text = speaker
        speaker = undefined
      options = defaults(options,
        speaker: speaker
        noise: 'none'
        bottom: @level.visibleHeight
      )
      say(speaker, text, options)

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
      return Promise.resolve() if @_skippingToCheckpoint()
      itemSettings = @inventory(options.item)
      item = (attrs) -> Crafty.e('PowerUp').attr(attrs).powerUp(itemSettings)
      unless itemSettings
        console.warn 'Item ', options.item, ' is not known'
        return Promise.resolve()
      if player = options.inFrontOf
        ship = player.ship()
        if ship
          item(z: -1, x: Crafty.viewport.width, y: player.ship().y + Crafty.viewport.y)
        else
          unless player.gameOver
            d = WhenJS.defer()
            player.entity.one 'ShipSpawned', (ship) =>
              item(z: -1, x: Crafty.viewport.width, y: ship.y + Crafty.viewport.y)
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

        item(x: coords.x, y: coords.y, z: -1)

  # Returns an object with information about a player
  #
  # @param 'nr' the player number to select
  #   it can also be the value 'anyActive' to select
  #   a random participating player
  #
  # @player(1)
  #  .name : name of the player
  #  .active : is the player active in the game
  #  .gameOver : has the player used all of its lives
  #  .ship() : Reference to the ship of the player
  #  .has(name) : Checking method if the ship has certain upgrades
  player: (nr) ->
    players = {}
    active = []
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
      if @lives > 0
        active.push @name
      else
        players[@name].active = no
        players[@name].gameOver = yes

    key = if nr is 'anyActive'
      sample(active)
    else
      "Player #{nr}"
    players[key]

  # Change the upcoming scenery.
  # Note that this scenery will be started out of screen,
  # and can take a while before it is fully in screen.
  #
  # @see `waitForScenery`
  setScenery: (scenery) ->
    (sequence) =>
      @_verify(sequence)
      return Promise.resolve() if @_skippingToCheckpoint()
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
      options = defaults(options,
        event: 'enter'
      )
      return Promise.resolve() if @_skippingToCheckpoint()
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

      { duration } = options
      if @_skippingToCheckpoint() or duration is 0
        @level.setHeight -height
      else
        d = WhenJS.defer()
        speedY = (height / duration) * 1000
        currentSpeed = @level._forcedSpeed?.x ? @level._forcedSpeed

        @level.setForcedSpeed({ x: currentSpeed, y: -speedY }, accellerate: yes)
        level = @level
        Crafty.e('Delay').delay(
          ->
            level.setForcedSpeed(currentSpeed, accellerate: yes)
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
      options = defaults(options,
        accellerate: yes
      )
      @level.setForcedSpeed speed, options

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
      options = defaults(
        { x, y }
        options
        {
          damage: 0
          radius: 20
          duration: 160
          viewportFixed: yes
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
      if (options.viewportFixed == no)
        e.addComponent('ViewportRelativeMotion')
        e.viewportRelativeMotion({ speed: 1 })

      if y > @_getSeaLevel() - 60 and options.lightness is 1.0
        e.addComponent('WaterSplashes')
        e.attr waterSplashSpeed: 500, defaultWaterCooldown: 450
        e.setDetectionOffset 40

      if options.damage
        e.ship = @entity.deathCause
        e.addComponent('Hostile')

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
      return Promise.resolve() if @_skippingToCheckpoint()
      Crafty.e('BigText').bigText(text, super: "Chapter #{number}:")

  showText: (text, options = {}) ->
    (sequence) =>
      @_verify(sequence)
      return Promise.resolve() if @_skippingToCheckpoint()
      Crafty.e('BigText').bigText(text, options)

  pickTarget: (selection, index = null) ->
    (sequence) =>
      pickTarget = (selection) ->
        entities = Crafty(selection)
        return null if entities.length is 0
        if index is null
          entities.get Math.floor(Math.random() * entities.length)
        else
          entities.get index

      # TODO: When this script is done, unbind events
      refreshTarget = (ship) =>
        @target = { x: ship.x, y: ship.y }
        Crafty.one 'ShipSpawned', (ship) =>
          @target = pickTarget(selection)
          @target.one 'Destroyed', refreshTarget

      @target = pickTarget(selection)

      if selection is 'PlayerControlledShip' and @target
        @target.one 'Destroyed', refreshTarget

  lockTarget: ->
    (sequence) =>
      @target = { x: @target.x, y: @target.y }

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
      @level.sealevelOffset = -offsetY
      level = @level
      Crafty.s('SeaLevel').setOffset(level.sealevelOffset)

  panCamera: (settings, duration) ->
    (sequence) =>
      @_verify(sequence)
      @level.panCamera(settings, duration)
      #if @_skippingToCheckpoint() or duration is 0

  addMinorScreenshake: ->
    (sequence) =>
      @_verify(sequence)
      @level.addTrauma(0.3)

  addTinyScreenshake: ->
    (sequence) =>
      @_verify(sequence)
      @level.addTrauma(0.2)

  slowMotionMoment: ->
    (sequence) =>
      @_verify(sequence)
      new Promise((resolve) ->
        setGameSpeed 0.3
        Crafty.e('Delay, TimeManager').delay(
          -> setGameSpeed 0.1
          500
          0
        ).delay(
          -> setGameSpeed 0.3
          1500
          0
        ).delay(
          ->
            setGameSpeed 1.0
            @destroy()
            resolve()
          2000
          0
        )
      )


  addMajorScreenshake: ->
    (sequence) =>
      @_verify(sequence)
      @level.addTrauma(0.5)

  screenFlash: (amount, options = {}) ->
    (sequence) =>
      @_verify(sequence)
      options = defaults(options, {
        duration: 200
        pauses: 400
        color: '#FF0000'
        alpha: 1
      })
      flasher = @_fader()
      defer = WhenJS.defer()

      flasher.attr(
        alpha: 0
      ).color(
        options.color
      ).delay(
        ->
          @attr alpha: options.alpha
          @delay(
            -> @attr alpha: 0
            options.duration
          )
        options.pauses
        amount
        ->
          @attr alpha: 0
          defer.resolve()
      )
      defer.promise

  setWeapons: (newWeapons) ->
    (sequence) =>
      @_verify(sequence)
      self = this
      Crafty('PlayerControlledShip').each ->
        @clearItems()
        for item in newWeapons
          itemSettings = self.inventory(item)
          @installItem itemSettings
      @level.setStartWeapons newWeapons

  inventory: (name) ->
    if name is 'pool'
      Crafty('Player').each ->
        if @eligibleForExtraLife() and name is 'pool'
          name = 'life'
          @rewardExtraLife()
    if name is 'pool'
      name = (@powerupPool || []).pop() || 'points'
    @level.inventory(name)

  inventoryAdd: (type, name, options) ->
    @level.inventoryAdd(type, name, options)

  setPowerupPool: (powerups...) ->
    (sequence) =>
      @_verify(sequence)
      @powerupPool = shuffle(powerups)

  hideHud: (settings = {}) ->
    settings = defaults(settings,
      visible: no
    )
    @toggleHud(settings)

  showHud: (settings = {}) ->
    settings = defaults(settings,
      visible: yes
    )
    @toggleHud(settings)

  toggleHud: (settings = {}) ->
    (sequence) =>
      @_verify(sequence)
      settings = defaults(settings,
        duration: 1000
      )
      Crafty('UILayerDOM, UILayerWebGL').each ->
        @addComponent('Tween')
        if @visible and settings.visible
          @tween(alpha: 1.0, settings.duration)
        else
          @tween(alpha: 0.0, settings.duration)
      @wait(settings.duration)(sequence).then =>
        Crafty('PlayerInfo').each ->
          @setVisibility(settings.visible)

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

  enableControls: ->
    (sequence) =>
      @_verify(sequence)
      Crafty('PlayerControlledShip').each -> @enableControl()

  screenFadeOut: ->
    (sequence) =>
      @_verify(sequence)
      fader = @_fader()

      defer = WhenJS.defer()

      fader.attr(
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
      fader = @_fader()

      defer = WhenJS.defer()

      fader.attr(
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

  cancelBullets: (selector, validator) ->
    (sequence) =>
      @_verify(sequence)
      validator ?= (e) -> true
      Crafty(selector).each -> @destroy() if validator(this)

  _fader: ->
    fader = Crafty('ScreenFader').get(0)
    unless fader?
      fader = Crafty.e('2D, UILayerDOM, Color, Tween, ScreenFader, Delay')

    fader.attr(
      x: 0,
      y: 0,
      z: 1000
    ).attr(
      w: Crafty.viewport.width
      h: Crafty.viewport.height
    )
    fader

module.exports =
  default: Level
