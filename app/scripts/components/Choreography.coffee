# TODO: Document
Crafty.c 'Choreography',
  init: ->
    @bind("EnterFrame", @_choreographyTick)

    @_ctypes =
      linear: @_executeLinear
      sine: @_executeSine
      delay: @_executeDelay
      viewport: @_executeMoveIntoViewport # move to position within viewport
      bezier: @_executeBezier

  remove: ->

  choreography: (c, repeats = 0) ->
    @_choreography = c
    @_repeats = repeats
    @_repeated = 0
    @_setupCPart(0)
    this

  synchChoreography: (otherComponent) ->
    @_choreography = _.clone otherComponent._choreography
    @_repeats = otherComponent._repeats
    @_repeated = otherComponent._repeated
    @_currentPart = _.clone otherComponent._currentPart
    @_currentPart.x += (@x - otherComponent.x)
    @_currentPart.y += (@y - otherComponent.y)
    @_currentPart.easing = _.clone otherComponent._currentPart.easing

  _setupCPart: (number) ->
    @_currentPart = null
    unless number < @_choreography.length
      if @_repeated < @_repeats or @_repeats is -1
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
    destinationX = -Crafty.viewport.x + @_currentPart.dx
    diffX = destinationX - @x
    motionX = (diffX * v)
    if @_currentPart.maxSpeed? and Math.abs(motionX) > @_currentPart.maxSpeed
      motionX = @_currentPart.maxSpeed
      motionX *= -1 if diffX < 0
    @x = @x + motionX

    destinationY = -Crafty.viewport.y + @_currentPart.dy
    diffY = destinationY - @y
    motionY = (diffY * v)
    if @_currentPart.maxSpeed? and Math.abs(motionY) > @_currentPart.maxSpeed
      motionY = @_currentPart.maxSpeed
      motionY *= -1 if diffX < 0
    @y = @y + motionY

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
    @x = point.x
    @y = point.y


