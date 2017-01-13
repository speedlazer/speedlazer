Crafty.c 'ViewportFixed',
  init: ->
    @_initialViewport =
      x: Crafty.viewport.x
      y: Crafty.viewport.y

  fixViewport: (@fixedAxis = ['x', 'y']) ->
    @motion = Crafty.bind 'CameraMove', (coords) =>
      shiftedX = (@_initialViewport.x + coords.x)
      shiftedY = (@_initialViewport.y + coords.y)

      @shiftedX ?= 0
      @shiftedX = Math.max(0, @shiftedX - .5)

      counterMotion = {}
      if 'x' in @fixedAxis
        counterMotion.x = @x + shiftedX + @shiftedX - coords.panning.x

      if 'y' in @fixedAxis
        counterMotion.y = @y + shiftedY - coords.panning.y

      @attr counterMotion

      @_initialViewport =
        x: -coords.x
        y: -coords.y
    this

  remove: ->
    Crafty.unbind('CameraMove', @motion) if @motion
