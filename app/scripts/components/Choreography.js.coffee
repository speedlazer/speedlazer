Crafty.c 'Choreography',
  init: ->
    @requires 'Tween'
    @bind("EnterFrame", @_choreographyTick)

  remove: ->

  choreography: (c) ->
    @_choreography = c
    @_setupCPart(0)
    this

  _setupCPart: (number) ->
    @_currentPart = null
    unless number < @_choreography.length
      @trigger 'ChoreographyEnd'
      return
    part = @_choreography[number]
    switch part.type
      when 'linear'
        @_currentPart =
          part: number
          type: part.type
          x: @x
          y: @y
          dx: part.x ? 0
          dy: part.y ? 0
          easing: new Crafty.easing(part.duration)

  _choreographyTick: (frameData) ->
    return unless @_currentPart?
    @_currentPart.easing.tick(frameData.dt)
    v = @_currentPart.easing.value()
    switch @_currentPart.type
      when 'linear'
        @x = @_currentPart.x + (v * @_currentPart.dx)
        @y = @_currentPart.y + (v * @_currentPart.dy)

    if @_currentPart.easing.complete
      @_setupCPart @_currentPart.part + 1

