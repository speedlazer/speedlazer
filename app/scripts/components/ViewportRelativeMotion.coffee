Crafty.c 'ViewportRelativeMotion',
  init: ->

  remove: ->

  viewportRelativeMotion: ({ x, y, speed }) ->
    @_startLocation = { x, y }
    @_speed = speed
    @_initialViewport =
      x: (Crafty.viewport.width / 4)
    @_location =
      sx: x + ((x - @_initialViewport.x) * (@_speed - 1))
      sy: y
      dx: @dx ? 0
      dy: @dy ? 0

    shifted = (@_initialViewport.x - Crafty.viewport._x) * (@_speed - 1)
    newX = @_location.sx - shifted + @_location.dx
    newY = @_location.sy - (Crafty.viewport._y * (1 - @_speed)) + @_location.dy
    @_location.x = newX
    @_location.y = newY
    @attr @_location

    @motion = Crafty.bind 'ViewportScroll', =>
      shifted = (@_initialViewport.x - Crafty.viewport._x) * (@_speed - 1)
      newX = @_location.sx - shifted + @dx
      newY = @_location.sy - (Crafty.viewport._y * (1 - @_speed)) + @dy
      @attr x: newX, y: newY
    this

  remove: ->
    Crafty.unbind 'ViewportScroll', @motion
