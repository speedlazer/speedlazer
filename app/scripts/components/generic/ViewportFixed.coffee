Crafty.c 'ViewportFixed',
  init: ->
    @_initialViewport =
      x: Crafty.viewport.x
      y: Crafty.viewport.y

    @motion = Crafty.bind 'ViewportScroll', =>
      shiftedX = (@_initialViewport.x - Crafty.viewport.x)
      shiftedY = (@_initialViewport.y - Crafty.viewport.y)

      @shiftedX ?= 0
      @shiftedX = Math.max(0, @shiftedX - .5)

      @attr x: @x + shiftedX + @shiftedX, y: @y + shiftedY
      @_initialViewport =
        x: Crafty.viewport.x
        y: Crafty.viewport.y

  remove: ->
    Crafty.unbind 'ViewportScroll', @motion
