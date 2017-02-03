Crafty.c 'ViewportFixed',
  init: ->
    @_initialViewport =
      x: Crafty.viewport.x
      y: Crafty.viewport.y

    @motion = Crafty.bind 'CameraMove', (coords) =>
      shiftedX = (@_initialViewport.x + coords.x) #- Crafty.viewport.xShift
      shiftedY = (@_initialViewport.y + coords.y) #- Crafty.viewport.yShift

      @shiftedX ?= 0
      @shiftedX = Math.max(0, @shiftedX - .5)

      @attr
        x: @x + shiftedX + @shiftedX - coords.panning.x
        y: @y + shiftedY - coords.panning.y

      @_initialViewport =
        x: -coords.x
        y: -coords.y

  remove: ->
    Crafty.unbind 'CameraMove', @motion
