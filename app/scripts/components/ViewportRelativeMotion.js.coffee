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
      x = @_location.x - shifted
      @attr x: x
    this

  remove: ->
    Crafty.unbind 'ViewportScroll', @motion
