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

    @attr @_location

    @motion = Crafty.bind 'ViewportScroll', =>
      shifted = (@_initialViewport.x - Crafty.viewport._x) * (@_speed - 1)
      newX = @_location.x - shifted
      newY = @_location.y - (Crafty.viewport._y * (1 - @_speed))
      @attr x: newX, y: newY
    this

  remove: ->
    #Crafty.unbind 'ViewportScroll', @motion
    Crafty.unbind 'CameraScroll', @motion
