# TODO: Document
Crafty.c 'Choreography',
  init: ->
    @bind('GameLoop', @_choreographyTick)

    @_ctypes =
      #bezier: @_executeBezier
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
    prevv = @_currentPart.easing.value()
    @_currentPart.easing.tick(frameData.dt + @_toSkip)
    @_toSkip = 0
    v = @_currentPart.easing.value()
    @_ctypes[@_currentPart.type].apply(this, [v, prevv])

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

  _executeLinear: (v) ->
    @x = @_currentPart.x + (v * (@_currentPart.dx ? 0))
    @y = @_currentPart.y + (v * (@_currentPart.dy ? 0))

  _executeDelay: (v) ->

  _executeMoveIntoViewport: (v, prevv) ->
    # the goal are current coordinates on screen
    destinationX = @_currentPart.dx
    if destinationX
      @_currentPart.moveOriginX ?= @_currentPart.x + Crafty.viewport.x - Crafty.viewport.xShift
      diffX = destinationX - @_currentPart.moveOriginX
      motionX = (diffX * v)
      pmotionX = (diffX * prevv)

      #@shiftedX ?= 0
      #@shiftedX = Math.max(0, @shiftedX - .5)

      #@x = @_currentPart.moveOriginX + motionX - Crafty.viewport.x + @shiftedX - Crafty.viewport.xShift
      @x += motionX - pmotionX #+ @shiftedX - Crafty.viewport.xShift

    destinationY = @_currentPart.dy
    if destinationY
      @_currentPart.moveOriginY ?= @_currentPart.y + Crafty.viewport.y - Crafty.viewport.yShift
      diffY = destinationY - @_currentPart.moveOriginY

      motionY = (diffY * v)
      pmotionY = (diffY * prevv)

      #@y = @_currentPart.moveOriginY + motionY - Crafty.viewport.y - Crafty.viewport.yShift
      @y += motionY - pmotionY

  _executeTween: (v) ->
    for k, p of @_currentPart.properties
      @[k] = (1 - v) * @_currentPart.currentProperties[k] + (v * p)

  #_executeBezier: (v) ->
    #bp = new Game.BezierPath
    #unless @_currentPart.bPath?
      #scaled = bp.scalePoints(@_currentPart.path,
        #origin:
          #x: @x
          #y: @y
        #scale:
          #x: Crafty.viewport.width
          #y: Crafty.viewport.height
      #)
      #@_currentPart.bPath = bp.buildPathFrom scaled
    #point = bp.pointOnPath(@_currentPart.bPath, v)

    #if @_currentPart.rotation
      #@rotation = bp.angleOnPath(@_currentPart.bPath, v)

    #@x = point.x
    #@y = point.y

  _executeViewportBezier: (v, prevv) ->
    bp = new Game.BezierPath
    unless @_currentPart.bPath?
      @_currentPart.bPath = bp.buildPathFrom @_currentPart.path
    unless @_currentPart.viewport?
      @_currentPart.viewport =
        y: Crafty.viewport.y

    if @_currentPart.rotation
      @rotation = bp.angleOnPath(@_currentPart.bPath, v)

    shiftedY = (@_currentPart.viewport.y - Crafty.viewport.y)
    point = bp.pointOnPath(@_currentPart.bPath, v)
    ppoint = bp.pointOnPath(@_currentPart.bPath, prevv)
    @shiftedX ?= 0
    dShiftX = @shiftedX
    @shiftedX = Math.max(0, @shiftedX - .5)

    @x += point.x - ppoint.x + (@shiftedX - dShiftX)
    @y += point.y - ppoint.y

