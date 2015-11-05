Game = @Game
Game.ScriptModule ?= {}

Game.ScriptModule.Level =
  placeSquad: (scriptClass, settings = {}) ->
    (sequence) =>
      @_verify(sequence)
      settings = _.defaults(settings,
        amount: 1
        delay: 1000
        options: {}
      )

      promises = (for i in [0...settings.amount]
        @wait(i * settings.delay)(sequence).then =>
          @runScript(scriptClass, settings.options)(sequence)
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

  say: (speaker, text) ->
    (sequence) =>
      @_verify(sequence)
      Game.say(speaker, text, bottom: @level.visibleHeight)

  drop: (options) ->
    (sequence) =>
      @_verify(sequence)
      item = @inventory('item', options.item)
      if player = options.inFrontOf
        @level.addComponent item().attr(z: -1), x: 640, y: player.ship().y
      if pos = options.location
        item().attr(x: pos.x, y: pos.y, z: -1)

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

  setScenery: (scenery) ->
    (sequence) =>
      @_verify(sequence)
      @level.setScenery scenery

  # Supported eventTypes:
  # - leave
  # - inScreen
  # - outScreen
  # - enter
  # - playerLeave
  # - playerEnter
  waitForScenery: (sceneryType, options = { event: 'enter' }) ->
    (sequence) =>
      @_verify(sequence)
      d = WhenJS.defer()
      @level.notifyScenery options.event, sceneryType, -> d.resolve()
      d.promise

  gainHeight: (height, options) ->
    (sequence) =>
      @_verify(sequence)
      d = WhenJS.defer()

      currentSpeed = @level._forcedSpeed?.x || @level._forcedSpeed
      { duration } = options
      speedY = (height / duration) * 1000

      @level.setForcedSpeed(x: currentSpeed, y: -speedY)
      level = @level
      Crafty.e('Delay').delay(
        ->
          level.setForcedSpeed(currentSpeed)
          d.resolve()
        options.duration
      )
      d.promise

  setSpeed: (speed) ->
    (sequence) =>
      @_verify(sequence)
      @level.setForcedSpeed speed

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

  explosion: (location, options = { damage: no, radius: 20 }) ->
    (sequence) =>
      @_verify(sequence)
      { x, y } = location()
      x -= Crafty.viewport.x
      y -= Crafty.viewport.y

      e = Crafty.e('Explosion').explode(
        x: x
        y: y
        w: 30
        h: 30
        radius: options.radius
      )
      if options.damage
        e.addComponent('Enemy')

