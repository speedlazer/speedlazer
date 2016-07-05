Game = @Game
Game.ScriptModule ?= {}

# Actions to control an entity in the game
#
# - bindSequence
# - sendToBackground
# - reveal
# - movePath
# - moveTo
# - rotate
# - synchronizeOn
# - location
#
Game.ScriptModule.Entity =
  # Change the execution sequence when the bound entity fires a trigger.
  #
  # You can use this to:
  # - Show an explosion when an enemy is killed
  # - Change the behaviour of an enemy when his health is below a certain point
  # - Let a barrel drop when touched
  #
  # example:
  #
  # @bindSequence 'Destroyed', @onKilled
  # @bindSequence 'Hit', @fase2, => @entity.health < 140000
  #
  # When the new sequence is triggered, the event is unbound from
  # the entity. So the sequence will always be started once. When a new
  # sequence is started, a current running one will be aborted.
  bindSequence: (eventName, sequenceFunction, filter) ->
    return unless sequenceFunction?
    filter ?= -> true
    eventHandler = (args...) =>
      return unless filter(args...)
      @entity.unbind(eventName, eventHandler)
      p = (sequence) =>
        @alternatePath = null
        WhenJS(sequenceFunction.apply(this, args)(sequence)).catch =>
          @alternatePath

      @currentSequence = sequence = Math.random()
      @alternatePath = p(sequence)
    @entity.bind(eventName, eventHandler)

  # remove an entity from the current gameplay. This means it cannot shoot
  # the player, and the player cannot shoot the entity. This is useful
  # for moving entities behind scenery.
  sendToBackground: (scale, z) ->
    (sequence) =>
      @_verify(sequence)
      @entity.sendToBackground(scale, z)

  reveal: ->
    (sequence) =>
      @_verify(sequence)
      @entity.reveal()

  animate: (reel, repeat, member) ->
    (sequence) =>
      @_verify(sequence)
      if member
        @entity[member].animate(reel, repeat)
      else
        @entity.animate(reel, repeat)

  scale: (scale, options = {}) ->
    (sequence) =>
      @_verify(sequence)
      oscale = @entity.scale ? 1.0
      options = _.defaults(options,
        duration: Math.abs(scale - oscale) * 1000
      )
      d = WhenJS.defer()

      cleanup = ->
        defer.resolve()

      @entity.tween({
        scale: scale
      }, options.duration).one 'TweenEnd', ->
        @unbind 'Remove', cleanup
        d.resolve()
      d.promise

  # Move an entity through a set of coordinates (relative to the viewport)
  # in a bezier path. By default the entity moves with its own 'defaultSpeed'
  # property, but it can be overridden with settings.
  #
  # example:
  #
  # @movePath [
  #   [320, 100]
  #   [100, 240]
  #   [320, 400]
  #   [550, 250]
  #   [-10, 100]
  # ]
  #
  # extra settings supported:
  # - speed: override the defaultSpeed of the entity (in px/sec)
  # - rotate: yes/no should the entity rotate along the path?
  # - skip: amount of milliseconds to skip in this animation
  # - easing: one of the following:
  #   - "linear" (default)
  #   - "smoothStep"
  #   - "smootherStep"
  #   - "easeInQuad"
  #   - "easeOutQuad"
  #   - "easeInOutQuad".
  # - continuePath: should this path continue the previous one
  movePath: (inputPath, settings = {}) ->
    (sequence) =>
      @_verify(sequence)
      return unless @enemy.alive
      settings = _.defaults(settings,
        rotate: yes
        skip: 0
        speed: @entity.defaultSpeed
        continuePath: no
        easing: 'linear'
        autoAccellerate: yes
      )
      path = [].concat inputPath

      path.unshift [
        Math.round(@entity.x + Crafty.viewport.x)
        Math.round(@entity.y + Crafty.viewport.y)
      ]

      pp = path[0]

      d = 0
      bezierPath = (for p in path
        if res = p?()
          x = res.x
          y = res.y
        else
          [x, y] = p

        if (-1 < x < 2)
          x *= Crafty.viewport.width

        if (-1 < y < 2)
          y *= Crafty.viewport.height

        pn = [x, y]

        [px, py] = pp
        a = Math.abs(x - px)
        b = Math.abs(y - py)
        c = Math.sqrt(a**2 + b**2)
        d += c
        pp = pn
        x -= Crafty.viewport.x
        y -= Crafty.viewport.y
        { x, y }
      )
      duration = (d / settings.speed) * 1000

      defer = WhenJS.defer()
      @entity.choreography(
        [
          type: 'viewportBezier'
          rotation: settings.rotate
          continuePath: settings.continuePath
          path: bezierPath
          duration: duration
          easingFn: settings.easing
        ], skip: settings.skip
      ).one('ChoreographyEnd', ->
        defer.resolve()
      )
      defer.promise

  _isFloat: (n) ->
    n is +n and n isnt (n|0)

  # Moves the entity to a coordinate
  # the provided coordinate can also be a function (that does not take arguments)
  # that returns an object with an 'x' and an 'y'.
  #
  # This method moves an entity below water if the Y gets below the 'seaLevel'
  #
  # extra settings can be provided:
  # - speed: override the default speed of the entity (in px/sec)
  # - easing: one of the following:
  #   - "linear" (default)
  #   - "smoothStep"
  #   - "smootherStep"
  #   - "easeInQuad"
  #   - "easeOutQuad"
  #   - "easeInOutQuad".
  moveTo: (location, extraSettings = {}) ->
    (sequence) =>
      @_verify(sequence)
      return unless @enemy.alive

      if typeof location is 'string'
        target = Crafty(location).get 0
        location = { x: target.x + Crafty.viewport.x, y: target.y + Crafty.viewport.y }

      settings = location?() ? location

      # When the location function returns null,
      # settings becomes the function, which is
      # invalid. So we need to safeguard against it.
      return WhenJS() if _.isFunction settings

      _.extend(settings, extraSettings)

      if settings.x? and (-1 < settings.x < 2)
        settings.x *= Crafty.viewport.width

      if settings.y? and (-1 < settings.y < 2)
        settings.y *= Crafty.viewport.height

      if settings.positionType is 'absoluteY'
        settings.y += Crafty.viewport.y

      throw new Error('location invalid') unless _.isObject(location)

      seaLevel = @_getSeaLevel()

      if @enemy.moveState is 'air'
        if settings.y? and settings.y + @entity.h > seaLevel + Crafty.viewport.y
          airSettings = _.clone settings
          airSettings.y = seaLevel - @entity.h
          return @_moveAir(airSettings)
            .then =>
              @enemy.moveState = 'water'
              if @enemy.alive
                @_setupWaterSpot()
                @_moveWater(settings)
        else
          return @_moveAir(settings)

      if @enemy.moveState is 'water'
        if settings.y? and settings.y + @entity.h < seaLevel + Crafty.viewport.y
          waterSettings = _.clone settings
          waterSettings.y = seaLevel - @entity.h
          return @_moveWater(waterSettings)
            .then =>
              @enemy.moveState = 'air'
              if @enemy.alive
                @_removeWaterSpot()
                @_moveAir(settings)
        else
          return @_moveWater(settings)

  moveThrough: (location) ->
    (sequence) =>
      @_verify(sequence)

      x = Math.round(@entity.x + Crafty.viewport.x)
      y = Math.round(@entity.y + Crafty.viewport.y)

      if res = location?()
        tx = res.x
        ty = res.y
      else
        [tx, ty] = location

      if tx? and ty?
        dx = tx - x
        dy = ty - y
      else
        dx = -1
        dy = 0

      rad = Math.atan2(dy, dx)
      fx = (Math.cos(rad) * 1000) + x
      fy = (Math.sin(rad) * 1000) + y

      @moveTo(x: fx, y: fy, rotation: yes)(sequence)

  _setupWaterSpot: ->
    if Game.explosionMode?
      waterSpot = Crafty.e('2D, WebGL, Color, Choreography, Tween')
        .color('#000040')
        .attr(
          w: @entity.w + 10
          x: @entity.x - 5
          y: @entity.y + @entity.h
          h: 20
          alpha: 0.7
          z: @entity.z - 1
        )
    else
      waterSpot = Crafty.e('2D, WebGL, shadow, Choreography, Tween')
        .attr(
          w: @entity.w + 10
          x: @entity.x - 5
          y: @_getSeaLevel() - 10
          h: 20
          z: @entity.z - 1
        )

    if Game.explosionMode?
      @_waterSplash()
    @entity.addComponent('WaterSplashes')
    @entity.setSealevel(@_getSeaLevel())

    if @entity.has('ViewportFixed')
      waterSpot.addComponent('ViewportFixed')
    @entity.hide(waterSpot, below: @_getSeaLevel())

  _removeWaterSpot: ->
    @entity.reveal()
    if Game.explosionMode?
      @_waterSplash()
    else
      @entity.removeComponent('WaterSplashes')

  _waterSplash: ->
    defer = WhenJS.defer()
    Crafty.e('WaterSplash').waterSplash(
      x: @entity.x
      y: @_getSeaLevel()
      size: @entity.w
    ).one 'ParticleEnd', ->
      defer.resolve()

    defer.promise

  _moveWater: (settings) ->
    defaults =
      speed: @entity.defaultSpeed

    if @entity.has('ViewportFixed')
      defaults.x = @entity.x + Crafty.viewport.x
      defaults.y = @entity.y + Crafty.viewport.y

    seaLevel = @_getSeaLevel()
    settings = _.defaults(settings, defaults)
    surfaceSize =
      w: @entity.w * 1.2
      h: (@entity.w / 3)
      alpha: 0.6
    maxSupportedDepth = 700
    maxDepthSize =
      w: @entity.w * .3
      h: 5
      alpha: 0.2

    deltaX = if settings.x? then Math.abs(settings.x - (@entity.hideMarker.x + Crafty.viewport.x)) else 0
    deltaY = if settings.y? then Math.abs(settings.y - (@entity.hideMarker.y + Crafty.viewport.y)) else 0
    delta = Math.sqrt((deltaX ** 2) + (deltaY ** 2))
    duration = (delta / settings.speed) * 1000

    if settings.y?
      depth = Math.max(0, Math.min(settings.y - @entity.h, maxSupportedDepth) - seaLevel)
      v = depth / (maxSupportedDepth - seaLevel)

      depthProperties = {}

      for k, p of surfaceSize
        depthProperties[k] = (1 - v) * p + (v * maxDepthSize[k])

      @entity.hideMarker.tween depthProperties, duration

    defer = WhenJS.defer()

    newH = depthProperties?.h ? @entity.hideMarker.h
    @entity.hideMarker.choreography([
      type: 'viewport'
      x: (settings.x + (@entity.w / 2)) - (@entity.hideMarker.w / 2)
      y: seaLevel - (newH / 2)
      maxSpeed: settings.speed
      duration: duration
    ]).one('ChoreographyEnd', ->
      defer.resolve()
    )
    WhenJS.all([defer.promise, @_moveAir(settings)])

  _getSeaLevel: ->
    (Crafty.viewport.height - 240) + (220 * (@entity.scale ? 1.0)) + (@level.sealevelOffset ? 0)

  _moveAir: (settings) ->
    defaults =
      speed: @entity.defaultSpeed

    if @entity.has('ViewportFixed')
      defaults.x = @entity.x + Crafty.viewport.x
      defaults.y = @entity.y + Crafty.viewport.y

    settings = _.defaults(settings, defaults)

    deltaX = if settings.x? then Math.abs(settings.x - (@entity.x + Crafty.viewport.x)) else 0
    deltaY = if settings.y? then Math.abs(settings.y - (@entity.y + Crafty.viewport.y)) else 0
    delta = Math.sqrt((deltaX ** 2) + (deltaY ** 2))

    defer = WhenJS.defer()
    easing = settings.easing ? 'linear'

    @entity.choreography(
      [
        type: 'viewport'
        x: settings.x
        y: settings.y
        rotation: settings.rotation
        easingFn: easing
        maxSpeed: settings.speed
        duration: (delta / settings.speed) * 1000
      ]
    ).one('ChoreographyEnd', ->
      defer.resolve()
    )
    defer.promise

  # Rotate the entity a given set of degrees over an amount of time
  rotate: (degrees, duration) ->
    (sequence) =>
      @_verify(sequence)
      defer = WhenJS.defer()
      cleanup = ->
        defer.resolve()
      @entity.one 'Remove', cleanup
      @entity.tween({ rotation: degrees }, duration)
        .one 'TweenEnd', ->
          @unbind 'Remove', cleanup
          defer.resolve()
      defer.promise

  # Synchronize all enitities within a squad.
  # This promise gets resolved if all entities in a squad
  # have reached this point in their script.
  # Very useful for orchestrated attacks
  synchronizeOn: (name) ->
    (sequence) =>
      # no sequence verification here, or else
      # enemies on an alternate path but still alive
      # will freeze others
      @synchronizer.synchronizeOn(name, this)

  setLocation: (location) ->
    (sequence) =>
      settings = location?() ? location
      { x, y } = settings

      if @_isFloat(x) or -1 < x < 2
        x *= Crafty.viewport.width

      if @_isFloat(y) or -1 < y < 2
        y *= Crafty.viewport.height

      @entity.attr(
        x: x - Crafty.viewport.x
        y: y - Crafty.viewport.y
      )

  location: (settings = {}) ->
    =>
      x: (@enemy.location.x ? (@entity.x + Crafty.viewport.x) + (@entity.w / 2)) + (settings.offsetX ? 0)
      y: (@enemy.location.y ? (@entity.y + Crafty.viewport.y) + (@entity.h / 2)) + (settings.offsetY ? 0)

  invincible: (yesNo) ->
    (sequence) =>
      @_verify(sequence)
      @entity.invincible = yesNo

  turnAround: ->
    (sequence) =>
      @_verify(sequence)
      @turned ?= @entity.xFlipped ? no
      @turned = !@turned
      if @turned
        @entity.flipX()
      else
        @entity.unflipX()

  deathDecoy: ->
    (sequence) =>
      @_verify(sequence)
      @decoy = @spawn(@options)
      { x, y } = @location()()
      @decoy.removeComponent('BurstShot')
      #@decoy.removeComponent('ViewportFixed')
      @decoy.attr(
        x: x - Crafty.viewport.x
        y: y - Crafty.viewport.y
        invincible: yes
        health: 1
      )
      @decoy.updatedHealth()
      if @entity.xFlipped
        @decoy.flipX()
      else
        @decoy.unflipX()
      @decoyingEntity = @entity
      @entity = @decoy

  endDecoy: ->
    (sequence) =>
      @decoy?.destroy()
      @decoy = null
      @entity = @decoyingEntity


