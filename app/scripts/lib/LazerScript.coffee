Game = @Game

class Game.LazerScript
  constructor: (@level) ->

  run: (args...) ->
    @currentSequence = Math.random()
    WhenJS(@execute(args...)(@currentSequence))

  execute: ->

  # DSL Implementation

  # Core
  sequence: (tasks...) ->
    (sequence) -> WhenJS.sequence(tasks, sequence)

  parallel: (tasks...) ->
    (sequence) -> WhenJS.parallel(tasks, sequence)

  if: (condition, block, elseBlock) ->
    (sequence) =>
      if condition.apply this
        block(sequence)
      else
        elseBlock?(sequence)

  while: (condition, block) ->
    (sequence) =>
      if condition.apply this
        WhenJS(block(sequence)).then =>
          @while(condition, block)(sequence)

  runScript: (scriptClass, args...) ->
    =>
      new scriptClass(@level).run(args...)

  runScriptAsync: (scriptClass, args...) ->
    =>
      new scriptClass(@level).run(args...)
      return

  wait: (amount) ->
    (sequence) =>
      console.log 'in wait', sequence
      d = WhenJS.defer()
      Crafty.e('Delay').delay(
        ->
          d.resolve()
          @destroy()
        amount
      )
      d.promise

  repeat: (times, event) ->
    (sequence) =>
      return if times is 0
      event(sequence).then =>
        @repeat(times - 1, event)(sequence)

  # Level
  say: (speaker, text) ->
    (sequence) =>
      # TODO: Drastically simplify 'showDialog' when all scripts are working
      d = WhenJS.defer()
      @level.showDialog([":#{speaker}:#{text}"]).on('Finished', -> d.resolve())
      d.promise

  #TODO: This will probably change soon
  wave: (formation, options = {}) ->
    (sequence) =>
      enemyConstructor = @inventory('enemy', options.enemy)
      wave = @level.spawnEnemies(formation, enemyConstructor)
      if options.drop
        wave.on 'LastDestroyed', (last) =>
          @drop(item: options.drop, location: last)()

      # TODO: Any - Wait, Kill
      @wait(wave.duration)(sequence)

  drop: (options) ->
    (sequence) =>
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
    (sequence) => @level.setScenery scenery

  waitForScenery: (sceneryType, options = { event: 'enter' }) ->
    (sequence) =>
      d = WhenJS.defer()
      @level.notifyScenery options.event, sceneryType, -> d.resolve()
      d.promise

  gainHeight: (height, options) ->
    (sequence) =>
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
      @level.setForcedSpeed speed

  showScore: ->
    (sequence) =>
      score = @level.finishStage()
      @wait(15 * 2000)().then =>
        score.destroy()

  disableWeapons: ->
    (sequence) =>
      @level.setWeaponsEnabled no

  enableWeapons: ->
    (sequence) =>
      @level.setWeaponsEnabled yes

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
class Game.EnemyScript extends Game.LazerScript

  run: (args...) ->
    @component = @spawn(args...)
    @component.attr
      x: @component.x - Crafty.viewport.x
      y: @component.y - Crafty.viewport.y
    @component.bind 'Destroyed', =>
      @enemy.location.x = (@component.x + Crafty.viewport.x)
      @enemy.location.y = (@component.y + Crafty.viewport.y)
      @enemy.alive = no

    @enemy =
      moveState: 'air'
      alive: yes
      location: {}

    super.then(-> console.log 'success').catch(-> console.log 'fail').finally(-> console.log 'ended')

  spawn: ->

  moveTo: (settings) ->
    (sequence) =>
      console.log 'in moveTo', sequence
      return unless @enemy.alive

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
    waterSpot = Crafty.e('2D, Canvas, Color, Choreography, Tween')
      .color('#000040')
      .attr(
        w: @component.w + 10
        x: @component.x - 5
        y: @component.y
        h: 20
        alpha: 0.7
        z: -1
      )
    @component.hide(waterSpot)

  _removeWaterSpot: ->
    @component.reveal()

  _waterSplash: ->
    defer = WhenJS.defer()
    waterSpot = Crafty.e('2D, Canvas, Color, Choreography')
      .color('#FFFFFF')
      .attr(
        x: @component.x - 5
        y: @component.y
        z: 1
        w: @component.w + 10
        h: 20
        alpha: 1.0
      )

    c = [
      type: 'tween'
      properties:
        h: 20 * @component.speed
        y: waterSpot.y - (20 * @component.speed)
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
      x: @component.x + Crafty.viewport.x
      y: @component.y + Crafty.viewport.y
      speed: @component.speed

    seaLevel = 420
    settings = _.defaults(settings, defaults)
    # TODO: Adjust water marker to movement position
    surfaceSize =
      w: @component.w + 10
      #x: @component.x - 5
      y: seaLevel
      h: 20
      alpha: 0.7
    maxSupportedDepth = 700
    maxDepthSize =
      w: @component.w * .3
      #x: @component.x + (@component.w * .3)
      y: @component.hideMarker.y + 15
      h: 5
      alpha: 0.2


    deltaX = if settings.x? then Math.abs(settings.x - (@component.x + Crafty.viewport.x)) else 0
    deltaY = if settings.y? then Math.abs(settings.y - (@component.y + Crafty.viewport.y)) else 0
    delta = Math.max(deltaX, deltaY)

    duration = (delta / settings.speed) * (1000 / Crafty.timer.FPS())

    if settings.y?
      depth = Math.min(settings.y, maxSupportedDepth)
      v = (depth - seaLevel) / (maxSupportedDepth - seaLevel)

      depthProperties = {}

      for k, p of surfaceSize
        depthProperties[k] = (1 - v) * p + (v * maxDepthSize[k])

      @component.hideMarker.tween depthProperties, duration

    defer = WhenJS.defer()
    @component.attr(
      x: settings.x - Crafty.viewport.x
      y: settings.y - Crafty.viewport.y
    )

    @component.hideMarker.choreography([
      type: 'follow'
      axis: 'x'
      target: @component
      maxSpeed: settings.speed
      duration: duration
    ]).bind('ChoreographyEnd', ->
      @unbind('ChoreographyEnd')
      defer.resolve()
    )
    defer.promise

  _moveAir: (settings) ->
    defaults =
      x: @component.x + Crafty.viewport.x
      y: @component.y + Crafty.viewport.y
      speed: @component.speed

    settings = _.defaults(settings, defaults)

    deltaX = if settings.x? then Math.abs(settings.x - (@component.x + Crafty.viewport.x)) else 0
    deltaY = if settings.y? then Math.abs(settings.y - (@component.y + Crafty.viewport.y)) else 0
    delta = Math.max(deltaX, deltaY)

    defer = WhenJS.defer()
    @component.choreography(
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
      x: @enemy.location.x ? (@component.x + Crafty.viewport.x)
      y: @enemy.location.y ? (@component.y + Crafty.viewport.y)

