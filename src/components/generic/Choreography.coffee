defaults = require('lodash/defaults')
clone = require('lodash/clone')
extend = require('lodash/extend')
BezierPath = require('src/lib/BezierPath').default

# TODO: Document
#
# I need to rethinkt the intentions of this component.
# It was setup as a sort of tweening chain, but promises in lazerscript work better
#
# The chaining is currently used in 1 part: The intro animation.
# So, step 1: Check if the intro animation can be done differently.
#
# 1. Synching of animation with other entities
#
# The intro animation uses the following:
# - linear (chained)
# - delay (chained)
#
# So, we could potentially remove the following:
#
# - viewport
# - viewportBezier
#
# The rest of the app uses the following: (entity script)
# - viewportBezier (non-chained)
# - viewport (non-chained)
#
#
#
Crafty.c 'Choreography',
  init: ->
    @_ctypes =
      delay: @_executeDelay
      linear: @_executeLinear
      viewport: @_executeMoveIntoViewport
      viewportBezier: @_executeViewportBezier

  remove: ->
    @unbind('GameLoop', @_choreographyTick)
    return unless @_currentPart?
    @_currentPart = null
    @_choreography = []
    @trigger('ChoreographyEnd')

  choreography: (c, options = {}) ->
    @uniqueBind('GameLoop', @_choreographyTick)
    @_options = defaults(options, {
      repeat: 0
      skip: 0
    })

    @_choreography = c
    @_repeated = 0
    part = 0
    @_setupCPart(part)
    toSkip = options.skip
    @_toSkip = 0
    if toSkip > 0
      while (part < @_choreography.length - 1) and toSkip > @_currentPart.duration
        toSkip -= @_currentPart.duration
        part += 1
        @_setupCPart(part)
      @_toSkip = toSkip
    this

  synchChoreography: (otherComponent) ->
    @_choreography = clone otherComponent._choreography
    @_options = otherComponent._options
    @_repeated = otherComponent._repeated
    @_toSkip = otherComponent._toSkip
    @_currentPart = clone otherComponent._currentPart
    @_currentPart.easing = clone otherComponent._currentPart.easing
    @uniqueBind('GameLoop', @_choreographyTick)

  _setupCPart: (number) ->
    @_currentPart = null
    unless number < @_choreography.length
      if @_repeated < @_options.repeat or @_options.repeats is -1
        @_repeated += 1
        number = 0
      else
        if @updateMovementVisuals?
          @updateMovementVisuals(undefined, 0, 0, 1)
        @_choreography = []
        @unbind('GameLoop', @_choreographyTick)
        @trigger 'ChoreographyEnd'
        @_px = @x
        @_py = @y
        return

    part = @_choreography[number]
    if part.event?
      @trigger(part.event, { entity: this, data: part.data })
    @_setupPart part, number

  motionDelta: ->
    {
      x: @x - @_px
      y: @y - @_py
    }

  _choreographyTick: (frameData) ->
    @_px = @x
    @_py = @y
    return unless @_currentPart?
    prevv = @_currentPart.easing.value()
    dt = frameData.dt + @_toSkip
    @_currentPart.easing.tick(dt)
    @_toSkip = 0
    v = @_currentPart.easing.value()
    @_ctypes[@_currentPart.type].apply(this, [v, prevv, dt])

    if @_currentPart.easing.complete
      @_setupCPart @_currentPart.part + 1

  _setupPart: (part, number) ->
    easingFn = part.easingFn ? 'linear'
    @_currentPart = extend(clone(part),
      part: number
      x: @x
      y: @y
      dx: part.x
      dy: part.y
      rotation: part.rotation
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
    @shift(dx, dy)

  _executeDelay: (v) ->

  _executeMoveIntoViewport: (v, prevv, dt) ->
    # the goal are current coordinates on screen
    destinationX = @_currentPart.dx
    dx = 0
    if destinationX
      @_currentPart.moveOriginX ?= @_currentPart.x
      diffX = destinationX - @_currentPart.moveOriginX
      motionX = (diffX * v)
      pmotionX = (diffX * prevv)
      dx = motionX - pmotionX

    destinationY = @_currentPart.dy
    dy = 0
    if destinationY
      @_currentPart.moveOriginY ?= @_currentPart.y
      diffY = destinationY - @_currentPart.moveOriginY
      motionY = (diffY * v)
      pmotionY = (diffY * prevv)
      dy = motionY - pmotionY

    if @updateMovementVisuals?
      if @_currentPart.rotation
        angle = Math.atan2(dy, dx)
        angle *= (180 / Math.PI)
        angle = (angle + 360 + 180) % 360
      else
        angle = undefined

      @updateMovementVisuals(angle, dx, dy, dt)

    @shift(dx, dy)

  _executeViewportBezier: (v, prevv, dt) ->
    bp = new BezierPath
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
      @rotation = rotation if rotation?

    @shift(dx, dy)

