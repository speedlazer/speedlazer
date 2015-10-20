Game = @Game

class Game.LazerScript
  constructor: (@level) ->

  run: (args...) ->
    WhenJS(@execute(args...)())

  execute: ->

  # DSL Implementation

  # Core
  sequence: (tasks...) ->
    -> WhenJS.sequence(tasks)

  parallel: (tasks...) ->
    -> WhenJS.parallel(tasks)

  if: (condition, block, elseBlock) ->
    =>
      if condition.apply this
        block()
      else
        elseBlock?()

  while: (condition, block) ->
    =>
      if condition.apply this
        WhenJS(block()).then =>
          @while(condition, block)()

  runScript: (scriptClass, args...) ->
    =>
      new scriptClass(@level).run(args...)

  runScriptAsync: (scriptClass, args...) ->
    =>
      new scriptClass(@level).run(args...)
      return

  wait: (amount) ->
    =>
      d = WhenJS.defer()
      Crafty.e('Delay').delay(
        ->
          d.resolve()
          @destroy()
        amount
      )
      d.promise

  repeat: (times, event) ->
    =>
      return if times is 0
      event().then =>
        @repeat(times - 1, event)()

  # Level
  say: (speaker, text) ->
    =>
      # TODO: Drastically simplify 'showDialog' when all scripts are working
      d = WhenJS.defer()
      @level.showDialog([":#{speaker}:#{text}"]).on('Finished', -> d.resolve())
      d.promise

  wave: (formation, options = {}) ->
    =>
      enemyConstructor = @inventory('enemy', options.enemy)
      wave = @level.spawnEnemies(formation, enemyConstructor)
      if options.drop
        wave.on 'LastDestroyed', (last) =>
          @drop(item: options.drop, location: last)()

      # TODO: Any - Wait, Kill
      @wait(wave.duration)()

  drop: (options) ->
    =>
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
    => @level.setScenery scenery

  waitForScenery: (sceneryType, options = { event: 'enter' }) ->
    =>
      d = WhenJS.defer()
      @level.notifyScenery options.event, sceneryType, -> d.resolve()
      d.promise

  gainHeight: (height, options) ->
    =>
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
    =>
      @level.setForcedSpeed speed

  showScore: ->
    =>
      score = @level.finishStage()
      @wait(15 * 2000)().then =>
        score.destroy()

  disableWeapons: ->
    =>
      @level.setWeaponsEnabled no

  enableWeapons: ->
    =>
      @level.setWeaponsEnabled yes

  # Enemy

  spawn: (constructor, label = 'default') ->
    =>
      @enemies ||= {}
      @enemies[label] = constructor()
      @enemies[label].moveState = 'air'

  moveTo: (settings) ->
    =>
      @enemies ||= {}
      enemy = @enemies[settings.enemy ? 'default']
      return unless enemy?

      seaLevel = 420

      if enemy.moveState is 'air'
        if settings.y? and settings.y > seaLevel
          airSettings = _.clone settings
          airSettings.y = seaLevel
          return @_moveAir(enemy, airSettings)
            .then =>
              enemy.moveState = 'water'
              if enemy.health > 0
                @_setupWaterSpot(enemy)
                @_waterSplash(enemy)
                @_moveWater(enemy, settings)
        else
          return @_moveAir(enemy, settings)

      if enemy.moveState is 'water'
        if settings.y? and settings.y < seaLevel
          waterSettings = _.clone settings
          waterSettings.y = seaLevel
          return @_moveWater(enemy, waterSettings)
            .then =>
              enemy.moveState = 'air'
              if enemy.health > 0
                @_removeWaterSpot(enemy)
                @_waterSplash(enemy)
                @_moveAir(enemy, settings)
        else
          return @_moveWater(enemy, settings)

  _setupWaterSpot: (enemy) ->
    waterSpot = Crafty.e('2D, Canvas, Color, Choreography, Tween')
      .color('#000040')
      .attr(
        w: enemy.w + 10
        x: enemy.x - 5
        y: enemy.y
        h: 20
        alpha: 0.7
        z: -1
      )
    enemy.hide(waterSpot)

  _removeWaterSpot: (enemy) ->
    enemy.reveal()

  _waterSplash: (enemy) ->
    defer = WhenJS.defer()
    waterSpot = Crafty.e('2D, Canvas, Color, Choreography')
      .color('#FFFFFF')
      .attr(
        x: enemy.x - 5
        y: enemy.y
        z: 1
        w: enemy.w + 10
        h: 20
        alpha: 1.0
      )

    c = [
      type: 'tween'
      properties:
        h: 20 * enemy.speed
        y: waterSpot.y - (20 * enemy.speed)
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

  _moveWater: (enemy, settings) ->
    defaults =
      x: enemy.x + Crafty.viewport.x
      y: enemy.y + Crafty.viewport.y
      speed: enemy.speed

    seaLevel = 420
    settings = _.defaults(settings, defaults)
    # TODO: Adjust water marker to movement position
    surfaceSize =
      w: enemy.w + 10
      #x: enemy.x - 5
      y: seaLevel
      h: 20
      alpha: 0.7
    maxSupportedDepth = 700
    maxDepthSize =
      w: enemy.w * .3
      #x: enemy.x + (enemy.w * .3)
      y: enemy.hideMarker.y + 15
      h: 5
      alpha: 0.2


    deltaX = if settings.x? then Math.abs(settings.x - (enemy.x + Crafty.viewport.x)) else 0
    deltaY = if settings.y? then Math.abs(settings.y - (enemy.y + Crafty.viewport.y)) else 0
    delta = Math.max(deltaX, deltaY)

    duration = (delta / settings.speed) * (1000 / Crafty.timer.FPS())

    if settings.y?
      depth = Math.min(settings.y, maxSupportedDepth)
      v = (depth - seaLevel) / (maxSupportedDepth - seaLevel)

      depthProperties = {}

      for k, p of surfaceSize
        depthProperties[k] = (1 - v) * p + (v * maxDepthSize[k])

      enemy.hideMarker.tween depthProperties, duration

    defer = WhenJS.defer()
    enemy.attr(
      x: settings.x - Crafty.viewport.x
      y: settings.y - Crafty.viewport.y
    )

    onDestroy = =>
      delete @enemies[settings.enemy ? 'default']
      defer.resolve()

    enemy.hideMarker.choreography([
      type: 'follow'
      axis: 'x'
      target: enemy
      maxSpeed: settings.speed
      duration: duration
    ]).bind('ChoreographyEnd', ->
      @unbind('ChoreographyEnd')
      @unbind('Destroyed', onDestroy)
      defer.resolve()
    ).bind('Destroyed', onDestroy)

    defer.promise

  _moveAir: (enemy, settings) ->
    defaults =
      x: enemy.x + Crafty.viewport.x
      y: enemy.y + Crafty.viewport.y
      speed: enemy.speed

    settings = _.defaults(settings, defaults)

    deltaX = if settings.x? then Math.abs(settings.x - (enemy.x + Crafty.viewport.x)) else 0
    deltaY = if settings.y? then Math.abs(settings.y - (enemy.y + Crafty.viewport.y)) else 0
    delta = Math.max(deltaX, deltaY)

    defer = WhenJS.defer()

    onDestroy = =>
      delete @enemies[settings.enemy ? 'default']
      defer.resolve()

    enemy.choreography(
      [
        type: 'viewport'
        x: settings.x
        y: settings.y
        maxSpeed: settings.speed
        duration: (delta / settings.speed) * (1000 / Crafty.timer.FPS())
      ]
    ).bind('ChoreographyEnd', ->
      @unbind('ChoreographyEnd')
      @unbind('Destroyed', onDestroy)
      defer.resolve()
    ).bind('Destroyed', onDestroy)
    defer.promise

  location: (settings = {}) ->
    =>
      enemy = @enemies[settings.enemy ? 'default']
      { x: enemy.x, y: enemy.y }

  enemy: (name = 'default') ->
    {
      alive: @enemies[name]?
    }

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

