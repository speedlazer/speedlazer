Crafty.c 'ViewportFixed',
  init: ->
    @_initialViewport =
      x: Crafty.viewport.x
      y: Crafty.viewport.y

    @motion = Crafty.bind 'ViewportScroll', =>
      shiftedX = (@_initialViewport.x - Crafty.viewport._x)
      shiftedY = (@_initialViewport.y - Crafty.viewport._y)
      @attr x: @x + shiftedX, y: @y + shiftedY
      @_initialViewport =
        x: Crafty.viewport.x
        y: Crafty.viewport.y

  remove: ->
    Crafty.unbind 'ViewportScroll', @motion
