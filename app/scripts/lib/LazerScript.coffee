Game = @Game

class Game.LazerScript
  constructor: (@level) ->

  run: (args...) ->
    @currentSequence = Math.random()
    WhenJS(@execute(args...)(@currentSequence))

  execute: ->

  # DSL Implementation

  # Core
  _verify: (sequence) ->
    throw new Error('sequence mismatch') unless sequence is @currentSequence

  sequence: (tasks...) ->
    (sequence) =>
      @_verify(sequence)
      WhenJS.sequence(tasks, sequence)

  parallel: (tasks...) ->
    (sequence) =>
      @_verify(sequence)
      WhenJS.parallel(tasks, sequence)

  if: (condition, block, elseBlock) ->
    (sequence) =>
      @_verify(sequence)
      if condition.apply this
        block(sequence)
      else
        elseBlock?(sequence)

  while: (condition, block) ->
    (sequence) =>
      @_verify(sequence)
      if block is undefined
        block = condition
        condition = -> true

      if condition.apply this
        WhenJS(block(sequence)).then =>
          @while(condition, block)(sequence)

  repeat: (times, block) ->
    (sequence) =>
      @_verify(sequence)
      # Syntactic sugar:
      # this allows for writing
      # @repeat(@sequence( ...
      #
      # which feels more natural
      # that a @while without a condition
      if block is undefined
        return @while(times)(sequence)

      return if times is 0
      WhenJS(block(sequence)).then =>
        @repeat(times - 1, block)(sequence)

  runScript: (scriptClass, args...) ->
    (sequence) =>
      @_verify(sequence)
      new scriptClass(@level).run(args...)

  runScriptAsync: (scriptClass, args...) ->
    (sequence) =>
      @_verify(sequence)
      new scriptClass(@level).run(args...)
      return

  wait: (amount) ->
    (sequence) =>
      @_verify(sequence)
      d = WhenJS.defer()
      Crafty.e('Delay').delay(
        ->
          d.resolve()
          @destroy()
        amount
      )
      d.promise

  # Level
  placeSquad: (scriptClass, settings = {}) ->
    (sequence) =>
      @_verify(sequence)
      settings = _.defaults(settings,
        amount: 1
        delay: 1000
      )

      promises = (for i in [0...settings.amount]
        @wait(i * settings.delay)(sequence).then =>
          @runScript(scriptClass)(sequence)
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
      # TODO: Drastically simplify 'showDialog' when all scripts are working
      d = WhenJS.defer()
      @level.showDialog([":#{speaker}:#{text}"]).on(
        'Finished', ->
          d.resolve()
      ).on(
        'Abort', ->
          d.resolve()
      )
      d.promise

  #TODO: This will probably change soon
  wave: (formation, options = {}) ->
    (sequence) =>
      @_verify(sequence)
      enemyConstructor = @inventory('enemy', options.enemy)
      wave = @level.spawnEnemies(formation, enemyConstructor)
      if options.drop
        wave.on 'LastDestroyed', (last) =>
          @drop(item: options.drop, location: last)(sequence)

      # TODO: Any - Wait, Kill
      @wait(wave.duration)(sequence)

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
      speedY = (height / ((duration / 1000.0) * Crafty.timer.FPS()))

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

  showScore: ->
    (sequence) =>
      @_verify(sequence)
      score = @level.finishStage()
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

  explosion: (location) ->
    (sequence) =>
      @_verify(sequence)
      { x, y } = location()
      x -= Crafty.viewport.x
      y -= Crafty.viewport.y

      Crafty.e('Explosion').explode({ x, y, w: 30, h: 30 })

  # Inventory
  # TODO: Decide how we handle inventory thoughout game

  inventory: (type, name) ->
    @invItems ||= {}
    @invItems[type] ||= {}
    @invItems[type][name || 'default']

  inventoryAdd: (type, name, constructor) ->
    @invItems ||= {}
    @invItems[type] ||= {}
    @invItems[type][name] = constructor


  # Enemy
class Game.EntityScript extends Game.LazerScript

  run: (args...) ->
    @entity = @spawn(args...)
    @boundEvents = []
    @entity.attr
      x: @entity.x - Crafty.viewport.x
      y: @entity.y - Crafty.viewport.y

    @entity.bind 'Destroyed', =>
      @enemy.location.x = (@entity.x + Crafty.viewport.x)
      @enemy.location.y = (@entity.y + Crafty.viewport.y)
      @enemy.alive = no
      @enemy.killedAt = new Date

    @enemy =
      moveState: 'air'
      alive: yes
      location: {}

    super
      .catch =>
        @alternatePath
      .finally =>
        if @enemy.alive
          @entity.destroy()
      .then =>
        @enemy

  spawn: ->

  bindSequence: (eventName, sequenceFunction, filter) ->
    filter ?= -> true
    eventHandler = (args...) =>
      return unless filter(args...)
      @currentSequence = Math.random()
      @entity.unbind(eventName, eventHandler)
      @alternatePath = WhenJS(sequenceFunction.apply(this, args)(@currentSequence))
        .catch =>
          @alternatePath
    @entity.bind(eventName, eventHandler)

  movePath: (path) ->
    (sequence) =>
      @_verify(sequence)
      return unless @enemy.alive
      path.unshift [
        @entity.x + Crafty.viewport.x
        @entity.y + Crafty.viewport.y
      ]

      pp = path[0]
      d = 0
      bezierPath = (for p in path
        [x, y] = p
        [px, py] = pp
        a = Math.abs(x - px)
        b = Math.abs(x - py)
        c = Math.sqrt(a**2 + b**2)
        d += c
        pp = p
        { x: x - Crafty.viewport.x, y: y - Crafty.viewport.y }
      )
      duration = ((d / @entity.speed) / Crafty.timer.FPS()) * 1000

      defer = WhenJS.defer()
      @entity.choreography(
        [
          type: 'viewportBezier'
          rotation: yes
          path: bezierPath
          duration: duration
        ], compensateCameraSpeed: yes
      ).bind('ChoreographyEnd', ->
        @unbind('ChoreographyEnd')
        defer.resolve()
      )
      defer.promise

  moveTo: (location, extraSettings = {}) ->
    (sequence) =>
      @_verify(sequence)
      return unless @enemy.alive
      settings = location?() ? location
      _.extend(settings, extraSettings)

      seaLevel = 420

      if @enemy.moveState is 'air'
        if settings.y? and settings.y > seaLevel + Crafty.viewport.y
          airSettings = _.clone settings
          airSettings.y = seaLevel
          return @_moveAir(airSettings)
            .then =>
              @enemy.moveState = 'water'
              if @enemy.alive > 0
                @_setupWaterSpot()
                @_waterSplash()
                @_moveWater(settings)
        else
          return @_moveAir(settings)

      if @enemy.moveState is 'water'
        if settings.y? and settings.y < seaLevel + Crafty.viewport.y
          waterSettings = _.clone settings
          waterSettings.y = seaLevel
          return @_moveWater(waterSettings)
            .then =>
              @enemy.moveState = 'air'
              if @enemy.alive
                @_removeWaterSpot()
                @_waterSplash()
                @_moveAir(settings)
        else
          return @_moveWater(settings)

  _setupWaterSpot: ->
    waterSpot = Crafty.e('2D, Canvas, Color, Choreography, Tween, ViewportFixed')
      .color('#000040')
      .attr(
        w: @entity.w + 10
        x: @entity.x - 5
        y: @entity.y
        h: 20
        alpha: 0.7
        z: -1
      )
    @entity.hide(waterSpot)

  _removeWaterSpot: ->
    @entity.reveal()

  _waterSplash: ->
    defer = WhenJS.defer()
    waterSpot = Crafty.e('2D, Canvas, Color, Choreography')
      .color('#FFFFFF')
      .attr(
        x: @entity.x - 5
        y: @entity.y
        z: 1
        w: @entity.w + 10
        h: 20
        alpha: 1.0
      )

    c = [
      type: 'tween'
      properties:
        h: 20 * @entity.speed
        y: waterSpot.y - (20 * @entity.speed)
        alpha: 0.2
      duration: 500
      event: 'splash'
    ,
      type: 'tween'
      properties:
        h: 20
        y: waterSpot.y - 20
        alpha: 0.0
      duration: 200
    ]
    waterSpot.choreography(c).bind 'ChoreographyEnd', ->
      defer.resolve()
      @destroy()

    defer.promise

  _moveWater: (settings) ->
    defaults =
      x: @entity.x + Crafty.viewport.x
      y: @entity.y + Crafty.viewport.y
      speed: @entity.speed

    seaLevel = 420
    settings = _.defaults(settings, defaults)
    # TODO: Adjust water marker to movement position
    surfaceSize =
      w: @entity.w + 10
      #x: @entity.x - 5
      y: seaLevel
      h: 20
      alpha: 0.7
    maxSupportedDepth = 700
    maxDepthSize =
      w: @entity.w * .3
      #x: @entity.x + (@entity.w * .3)
      y: @entity.hideMarker.y + 15
      h: 5
      alpha: 0.2

    deltaX = if settings.x? then Math.abs(settings.x - (@entity.hideMarker.x + Crafty.viewport.x)) else 0
    deltaY = if settings.y? then Math.abs(settings.y - (@entity.hideMarker.y + Crafty.viewport.y)) else 0
    delta = Math.max(deltaX, deltaY)

    duration = (delta / settings.speed) * (1000 / Crafty.timer.FPS())

    if settings.y?
      depth = Math.min(settings.y, maxSupportedDepth)
      v = (depth - seaLevel) / (maxSupportedDepth - seaLevel)

      depthProperties = {}

      for k, p of surfaceSize
        depthProperties[k] = (1 - v) * p + (v * maxDepthSize[k])

      @entity.hideMarker.tween depthProperties, duration

    defer = WhenJS.defer()
    @entity.attr(
      x: settings.x - Crafty.viewport.x
      y: settings.y - Crafty.viewport.y
    )

    @entity.hideMarker.choreography([
      type: 'follow'
      axis: 'x'
      target: @entity
      maxSpeed: settings.speed
      duration: duration
    ]).bind('ChoreographyEnd', ->
      @unbind('ChoreographyEnd')
      defer.resolve()
    )
    defer.promise

  _moveAir: (settings) ->
    defaults =
      x: @entity.x + Crafty.viewport.x
      y: @entity.y + Crafty.viewport.y
      speed: @entity.speed

    settings = _.defaults(settings, defaults)

    deltaX = if settings.x? then Math.abs(settings.x - (@entity.x + Crafty.viewport.x)) else 0
    deltaY = if settings.y? then Math.abs(settings.y - (@entity.y + Crafty.viewport.y)) else 0
    delta = Math.max(deltaX, deltaY)

    defer = WhenJS.defer()
    @entity.choreography(
      [
        type: 'viewport'
        x: settings.x
        y: settings.y
        maxSpeed: settings.speed
        duration: (delta / settings.speed) * (1000 / Crafty.timer.FPS())
      ]
    ).bind('ChoreographyEnd', ->
      @unbind('ChoreographyEnd')
      defer.resolve()
    )
    defer.promise

  location: (settings = {}) ->
    =>
      x: @enemy.location.x ? (@entity.x + Crafty.viewport.x)
      y: @enemy.location.y ? (@entity.y + Crafty.viewport.y)

  pickTarget: (selection) ->
    (sequence) =>
      ships = Crafty(selection)
      @target = ships.get Math.floor(Math.random() * ships.length)

  targetLocation: (override = {}) ->
    =>
      x: override.x ? (@target.x + Crafty.viewport.x)
      y: override.y ? (@target.y + Crafty.viewport.y)
