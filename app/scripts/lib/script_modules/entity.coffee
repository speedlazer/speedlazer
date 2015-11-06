Game = @Game
Game.ScriptModule ?= {}

Game.ScriptModule.Entity =
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

  sendToBackground: (scale, z) ->
    (sequence) =>
      @_verify(sequence)
      @entity.sendToBackground(scale, z)

  movePath: (path, settings = {}) ->
    (sequence) =>
      @_verify(sequence)
      return unless @enemy.alive
      settings = _.defaults(settings,
        rotate: yes
      )
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
      duration = (d / @entity.speed) * 1000

      defer = WhenJS.defer()
      @entity.choreography(
        [
          type: 'viewportBezier'
          rotation: settings.rotate
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

      seaLevel = @_getSeaLevel()

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
        z: @entity.z - 1
      )
    @entity.hide(waterSpot)

  _removeWaterSpot: ->
    @entity.reveal()

  _waterSplash: ->
    defer = WhenJS.defer()

    options =
      maxParticles: 40
      size: 18
      sizeRandom: 4
      speed: 1
      speedRandom: 1.2
      # Lifespan in frames
      lifeSpan: 29
      lifeSpanRandom: 7
      # Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
      angle: 0
      angleRandom: 34
      startColour: [235, 235, 255, 1]
      startColourRandom: [48, 50, 45, 0.2]
      endColour: [235, 235, 235, 0]
      endColourRandom: [60, 60, 60, 0.1]
      # Only applies when fastMode is off, specifies how sharp the gradients are drawn
      sharpness: 20
      sharpnessRandom: 10
      # Random spread from origin
      spread: 20
      # How many frames should this last
      duration: 700 / Crafty.timer.FPS()
      # Will draw squares instead of circle gradients
      #fastMode: false,
      fastMode: yes
      gravity: { x: 0, y: - (@entity.speed / 1000) }
      # sensible values are 0-3
      jitter: 0
    p = Crafty.e("2D,Canvas,Particles").attr(
      x: @entity.x
      y: @entity.y
    ).particles(options).bind 'ParticleEnd', ->
      defer.resolve()
      @destroy()

    #waterSpot = Crafty.e('2D, Canvas, Color, Choreography')
      #.color('#FFFFFF')
      #.attr(
        #x: @entity.x - 5
        #y: @entity.y
        #z: @entity.z + 1
        #w: @entity.w + 10
        #h: 20
        #alpha: 1.0
      #)

    #c = [
      #type: 'tween'
      #properties:
        #h: (@entity.speed / 3)
        #y: waterSpot.y - (@entity.speed / 3)
        #alpha: 0.2
      #duration: 500
      #event: 'splash'
    #,
      #type: 'tween'
      #properties:
        #h: 20
        #y: waterSpot.y - 20
        #alpha: 0.0
      #duration: 200
    #]
    #waterSpot.choreography(c).bind 'ChoreographyEnd', ->
      #@destroy()

    defer.promise

  _moveWater: (settings) ->
    defaults =
      x: @entity.x + Crafty.viewport.x
      y: @entity.y + Crafty.viewport.y
      speed: @entity.speed

    seaLevel = @_getSeaLevel()
    settings = _.defaults(settings, defaults)
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
    delta = Math.sqrt((deltaX ** 2) + (deltaY ** 2))
    duration = (delta / settings.speed) * 1000

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
      type: 'viewport'
      x: settings.x
      maxSpeed: settings.speed
      duration: duration
    ]).bind('ChoreographyEnd', ->
      @unbind('ChoreographyEnd')
      defer.resolve()
    )
    defer.promise

  _getSeaLevel: ->
    220 + (220 * (@entity.scale ? 1.0))

  _moveAir: (settings) ->
    defaults =
      x: @entity.x + Crafty.viewport.x
      y: @entity.y + Crafty.viewport.y
      speed: @entity.speed

    settings = _.defaults(settings, defaults)

    deltaX = if settings.x? then Math.abs(settings.x - (@entity.x + Crafty.viewport.x)) else 0
    deltaY = if settings.y? then Math.abs(settings.y - (@entity.y + Crafty.viewport.y)) else 0
    delta = Math.sqrt((deltaX ** 2) + (deltaY ** 2))

    defer = WhenJS.defer()
    @entity.choreography(
      [
        type: 'viewport'
        x: settings.x
        y: settings.y
        maxSpeed: settings.speed
        duration: (delta / settings.speed) * 1000
      ]
    ).bind('ChoreographyEnd', ->
      @unbind('ChoreographyEnd')
      defer.resolve()
    )
    defer.promise

  location: (settings = {}) ->
    =>
      x: (@enemy.location.x ? (@entity.x + Crafty.viewport.x) + (@entity.w / 2))
      y: (@enemy.location.y ? (@entity.y + Crafty.viewport.y) + (@entity.h / 2))

  pickTarget: (selection) ->
    (sequence) =>
      ships = Crafty(selection)
      @target = ships.get Math.floor(Math.random() * ships.length)

  targetLocation: (override = {}) ->
    =>
      x: override.x ? (@target.x + Crafty.viewport.x)
      y: override.y ? (@target.y + Crafty.viewport.y)
