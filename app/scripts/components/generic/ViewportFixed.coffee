Crafty.c 'ViewportFixed',
  init: ->
    @_initialViewport =
      x: Crafty.viewport.x
      y: Crafty.viewport.y

    @motion = Crafty.bind 'CameraMove', (coords) =>
      shiftedX = (@_initialViewport.x + coords.x)
      shiftedY = (@_initialViewport.y + coords.y)

      @shiftedX ?= 0
      @shiftedX = Math.max(0, @shiftedX - .5)

      @attr x: @x + shiftedX + @shiftedX, y: @y + shiftedY
      @_initialViewport =
        x: -coords.x
        y: -coords.y

  remove: ->
    Crafty.unbind 'CameraMove', @motion
