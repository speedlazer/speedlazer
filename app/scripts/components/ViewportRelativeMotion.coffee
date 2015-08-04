Crafty.c 'ViewportRelativeMotion',
  init: ->

  remove: ->

  viewportRelativeMotion: ({ x, y, speed }) ->
    @_startLocation = { x, y }
    @_speed = speed
    @_initialViewport =
      x: (Crafty.viewport.width / 4)
    @_location =
      x: x + ((x - @_initialViewport.x) * (@_speed - 1))
      y: y
      dx: @dx ? 0
      dy: @dy ? 0

    @attr @_location

    @motion = Crafty.bind 'ViewportScroll', =>
      shifted = (@_initialViewport.x - Crafty.viewport._x) * (@_speed - 1)
      newX = @_location.x - shifted + @dx
      newY = @_location.y - (Crafty.viewport._y * (1 - @_speed)) + @dy
      @attr x: newX, y: newY
    this

  remove: ->
    Crafty.unbind 'CameraScroll', @motion
