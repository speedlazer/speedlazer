# TODO: Document
Crafty.c 'Choreography',
  init: ->
    @bind("EnterFrame", @_choreographyTick)

    @_ctypes =
      bezier: @_executeBezier
      delay: @_executeDelay
      linear: @_executeLinear
      viewport: @_executeMoveIntoViewport
      viewportBezier: @_executeViewportBezier
      tween: @_executeTween

  remove: ->
    return unless @_currentPart?
    @_currentPart = null
    @trigger('ChoreographyEnd')

  choreography: (c, options = {}) ->
    @_options = _.defaults(options, {
      repeat: 0
      compensateCameraSpeed: no
    })
    if @_options.compensateCameraSpeed
      @camera = Crafty(Crafty('ScrollWall')[0])
      @_options.cameraLock =
        x: @camera.x

    @_choreography = c
    @_repeated = 0
    @_setupCPart(0)
    this

  synchChoreography: (otherComponent) ->
    @_choreography = _.clone otherComponent._choreography
    @_options = otherComponent._options
    @_repeated = otherComponent._repeated
    @_currentPart = _.clone otherComponent._currentPart
    @_currentPart.x += (@x - otherComponent.x)
    @_currentPart.y += (@y - otherComponent.y)
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
    @_currentPart.easing.tick(frameData.dt)
    v = @_currentPart.easing.value()
    @_ctypes[@_currentPart.type].apply(this, [v])

    if @_options.compensateCameraSpeed
      @x += ((@camera.x - @_options.cameraLock.x))

    if @_currentPart.easing.complete
      @_setupCPart @_currentPart.part + 1

  _setupPart: (part, number) ->
    @_currentPart = _.extend(_.clone(part),
      part: number
      x: @x
      y: @y
      dx: part.x ? 0
      dy: part.y ? 0
      easing: new Crafty.easing(part.duration ? 0)
    )
    if part.properties
      currentProperties = {}
      for k of part.properties
        currentProperties[k] = @[k]
      @_currentPart.currentProperties = currentProperties

  _executeLinear: (v) ->
    @x = @_currentPart.x + (v * @_currentPart.dx)
    @y = @_currentPart.y + (v * @_currentPart.dy)

  _executeDelay: (v) ->

  _executeMoveIntoViewport: (v) ->
    # the goal are current coordinates on screen
    destinationX = @_currentPart.dx
    @_currentPart.moveOriginX ?= @_currentPart.x + Crafty.viewport.x
    diffX = destinationX - @_currentPart.moveOriginX
    motionX = (diffX * v)
    @x = @_currentPart.moveOriginX + motionX - Crafty.viewport.x

    destinationY = @_currentPart.dy
    @_currentPart.moveOriginY ?= @_currentPart.y + Crafty.viewport.y
    diffY = destinationY - @_currentPart.moveOriginY

    motionY = (diffY * v)
    @y = @_currentPart.moveOriginY + motionY - Crafty.viewport.y

  _executeTween: (v) ->
    for k, p of @_currentPart.properties
      @[k] = (1 - v) * @_currentPart.currentProperties[k] + (v * p)

  _executeBezier: (v) ->
    bp = new Game.BezierPath
    unless @_currentPart.bPath?
      scaled = bp.scalePoints(@_currentPart.path,
        origin:
          x: @x
          y: @y
        scale:
          x: Crafty.viewport.width
          y: Crafty.viewport.height
      )
      @_currentPart.bPath = bp.buildPathFrom scaled
    point = bp.pointOnPath(@_currentPart.bPath, v)

    if @_currentPart.rotation
      @rotation = bp.angleOnPath(@_currentPart.bPath, v)

    @x = point.x
    @y = point.y

  _executeViewportBezier: (v) ->
    bp = new Game.BezierPath
    unless @_currentPart.bPath?
      @_currentPart.bPath = bp.buildPathFrom @_currentPart.path
    point = bp.pointOnPath(@_currentPart.bPath, v)

    if @_currentPart.rotation
      @rotation = bp.angleOnPath(@_currentPart.bPath, v)

    @x = point.x
    @y = point.y


