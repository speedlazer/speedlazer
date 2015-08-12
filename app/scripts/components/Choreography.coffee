# TODO: Document
Crafty.c 'Choreography',
  init: ->
    @bind("EnterFrame", @_choreographyTick)

    @_ctypes =
      linear: @_executeLinear
      sine: @_executeSine
      delay: @_executeDelay
      viewport: @_executeMoveIntoViewport # move to position within viewport

  remove: ->

  choreography: (c, repeats = 0) ->
    @_choreography = c
    @_repeats = repeats
    @_repeated = 0
    @_setupCPart(0)
    this

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
    @_currentPart =
      part: number
      type: part.type
      x: @x
      y: @y
      dx: part.x ? 0
      dy: part.y ? 0
      length: part.length ? 1
      start: part.start ? 0
      maxSpeed: part.maxSpeed
      easing: new Crafty.easing(part.duration ? 0)

  _executeLinear: (v) ->
    @x = @_currentPart.x + (v * @_currentPart.dx)
    @y = @_currentPart.y + (v * @_currentPart.dy)

  _executeSine: (v) ->
    halfY = @_currentPart.dy
    @x = @_currentPart.x + (v * @_currentPart.dx)
    @y = @_currentPart.y + (Math.sin(-(Math.PI + (Math.PI * @_currentPart.start * 2)) + (v * @_currentPart.length * Math.PI * 2)) * halfY)

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


