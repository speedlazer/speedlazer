# TODO: Document
Crafty.c 'Choreography',
  init: ->
    @bind('GameLoop', @_choreographyTick)

    @_ctypes =
      delay: @_executeDelay
      linear: @_executeLinear
      viewport: @_executeMoveIntoViewport
      viewportBezier: @_executeViewportBezier

  remove: ->
    return unless @_currentPart?
    @_currentPart = null
    @trigger('ChoreographyEnd')

  choreography: (c, options = {}) ->
    @_options = _.defaults(options, {
      repeat: 0
      compensateCameraSpeed: no
      skip: 0
    })
    if @_options.compensateCameraSpeed
      @camera = Crafty(Crafty('ScrollWall')[0])
      @_options.cameraLock =
        x: @camera.x

    @_choreography = c
    @_repeated = 0
    part = 0
    @_setupCPart(part)
    toSkip = options.skip
    @_toSkip = 0
    if toSkip > 0
      while toSkip > @_currentPart.duration
        toSkip -= @_currentPart.duration
        part += 1
        @_setupCPart(part)
      @_toSkip = toSkip
    this

  synchChoreography: (otherComponent) ->
    @_choreography = _.clone otherComponent._choreography
    @_options = otherComponent._options
    @_repeated = otherComponent._repeated
    @_toSkip = otherComponent._toSkip
    @_currentPart = _.clone otherComponent._currentPart
    @_currentPart.easing = _.clone otherComponent._currentPart.easing

  _setupCPart: (number) ->
    @_currentPart = null
    unless number < @_choreography.length
      if @_repeated < @_options.repeat or @_options.repeats is -1
        @_repeated += 1
        number = 0
      else
        @trigger 'ChoreographyEnd'
        return

    part = @_choreography[number]
    if part.event?
      @trigger(part.event, { entity: this, data: part.data })
    @_setupPart part, number

  _choreographyTick: (frameData) ->
    return unless @_currentPart?
    prevv = @_currentPart.easing.value()
    dt = frameData.dt + @_toSkip
    @_currentPart.easing.tick(dt)
    @_toSkip = 0
    v = @_currentPart.easing.value()
    @_ctypes[@_currentPart.type].apply(this, [v, prevv, dt])

    if @_options.compensateCameraSpeed
      @x += ((@camera.x - @_options.cameraLock.x))

    if @_currentPart.easing.complete
      @_setupCPart @_currentPart.part + 1

  _setupPart: (part, number) ->
    easingFn = part.easingFn ? 'linear'
    @_currentPart = _.extend(_.clone(part),
      part: number
      x: @x
      y: @y
      dx: part.x
      dy: part.y
      easing: new Crafty.easing(part.duration ? 0, easingFn)
    )
    if part.properties
      currentProperties = {}
      for k of part.properties
        currentProperties[k] = @[k]
      @_currentPart.currentProperties = currentProperties

  _executeLinear: (v, prevv) ->
    dx = (v * (@_currentPart.dx ? 0)) - (prevv * (@_currentPart.dx ? 0))
    dy = (v * (@_currentPart.dy ? 0)) - (prevv * (@_currentPart.dy ? 0))

    @x += dx
    @y += dy

  _executeDelay: (v) ->

  _executeMoveIntoViewport: (v, prevv, dt) ->
    # the goal are current coordinates on screen
    destinationX = @_currentPart.dx
    dx = 0
    if destinationX
      @_currentPart.moveOriginX ?= @_currentPart.x + Crafty.viewport.x - Crafty.viewport.xShift
      diffX = destinationX - @_currentPart.moveOriginX
      motionX = (diffX * v)
      pmotionX = (diffX * prevv)
      dx = motionX - pmotionX #+ @shiftedX - Crafty.viewport.xShift

    destinationY = @_currentPart.dy
    dy = 0
    if destinationY
      @_currentPart.moveOriginY ?= @_currentPart.y + Crafty.viewport.y - Crafty.viewport.yShift
      diffY = destinationY - @_currentPart.moveOriginY
      motionY = (diffY * v)
      pmotionY = (diffY * prevv)
      dy = motionY - pmotionY

    if @updateMovementVisuals?
      @updateMovementVisuals(undefined, dx, dy, dt)

    @x += dx
    @y += dy

  _executeViewportBezier: (v, prevv, dt) ->
    bp = new Game.BezierPath
    unless @_currentPart.bPath?
      p = @_currentPart.path
      if @_lastBezierPathPoint? and @_currentPart.continuePath
        p.unshift {
          x: @_lastBezierPathPoint.x
          y: @_lastBezierPathPoint.y
        }
      @_currentPart.bPath = bp.buildPathFrom p

      if @_lastBezierPathPoint? and @_currentPart.continuePath
        firstCurve = @_currentPart.bPath.curves.shift()
        # We need to recalculate the distance. If we would just
        # subtract the distance of the first curve of the total,
        # somehow JS manages to be off at 10 decimals at the fragment.
        # ... Which breaks the determining of points at the curve
        recalcDist = 0.0
        recalcDist += c.distance for c in @_currentPart.bPath.curves
        @_currentPart.bPath.distance = recalcDist
        @_lastBezierPathPoint = null

      # We always remember the single-last point for bending of the next curve,
      # if the next curve has `continuePath` enabled.
      #
      #     ,--B-,.
      #   ,`       `';.
      #  :             `C
      # A
      #
      # In the path from A to B, B is the last point. The new path is
      # a continuation, so B is its starting point. To have the line
      # from B to C bend in a natural manner, Point A must be evaluated
      # as well for the bending of B towards C. So for the proper curve for
      # B to C, we do not need the last point of the previous path (since it
      # is the same as the first of the new path, but we actually need the
      # single-last one. (length - 2)
      @_lastBezierPathPoint = @_currentPart.path[@_currentPart.path.length - 2]

    unless @_currentPart.viewport?
      @_currentPart.viewport =
        y: Crafty.viewport.y


    shiftedY = (@_currentPart.viewport.y - Crafty.viewport.y)
    point = bp.pointOnPath(@_currentPart.bPath, v)
    ppoint = bp.pointOnPath(@_currentPart.bPath, prevv)
    @shiftedX ?= 0
    dShiftX = @shiftedX
    @shiftedX = Math.max(0, @shiftedX - .5)

    dx = point.x - ppoint.x + (@shiftedX - dShiftX)
    dy = point.y - ppoint.y

    if @_currentPart.rotation
      rotation = bp.angleOnPath(@_currentPart.bPath, v)

    if @updateMovementVisuals?
      @updateMovementVisuals(rotation, dx, dy, dt)
    else
      @rotation = rotation

    @x += dx
    @y += dy

