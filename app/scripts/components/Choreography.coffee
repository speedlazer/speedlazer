# TODO: Document
Crafty.c 'Choreography',
  init: ->
    @bind("EnterFrame", @_choreographyTick)

    @_ctypes =
      linear: @_executeLinear
      sine: @_executeSine
      delay: @_executeDelay
      viewport: @_executeMoveIntoViewport # move to position within viewport
      follow: @_executeFollow
      tween: @_executeTween
      bezier: @_executeBezier
      viewportBezier: @_executeViewportBezier

  remove: ->
    return unless @_currentPart?
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
      # TODO: Figure out why we need the magic .7 to get enemies off screen.
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

  _executeSine: (v) ->
    halfY = @_currentPart.dy
    @x = @_currentPart.x + (v * @_currentPart.dx)
    @y = @_currentPart.y + (Math.sin(-(Math.PI + (Math.PI * @_currentPart.start * 2)) + (v * @_currentPart.repeat * Math.PI * 2)) * halfY)

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

  _executeFollow: (v) ->
    # the goal are current coordinates on screen
    destinationX = @_currentPart.target.x + (@_currentPart.target.w // 2)
    destinationX -= @w // 2

    diffX = destinationX - @x
    motionX = (diffX * v)
    if @_currentPart.maxSpeed? and Math.abs(motionX) > @_currentPart.maxSpeed
      motionX = @_currentPart.maxSpeed
      motionX *= -1 if diffX < 0

    @x = @x + motionX

    #destinationY = @_currentPart.dy
    #diffY = destinationY - @y
    #motionY = (diffY * v)
    #if @_currentPart.maxSpeed? and Math.abs(motionY) > @_currentPart.maxSpeed
      #motionY = @_currentPart.maxSpeed
      #motionY *= -1 if diffX < 0
    #@y = @y + motionY

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
    #if point.c isnt @_currentPart.curveIndex
      #i = point.c
        #JSON.stringify(@_currentPart.path[i]), ' to ',
        #JSON.stringify(@_currentPart.path[i + 1])

      #@_currentPart.curveIndex = point.c

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

    @x = point.x #- Crafty.viewport.x
    @y = point.y #- Crafty.viewport.y


