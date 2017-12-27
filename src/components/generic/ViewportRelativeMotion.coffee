correction = 0.125

calculateY = (delta, speed) ->
  delta * (speed - (correction - (correction * speed)))

Crafty.c 'ViewportRelativeMotion',
  init: ->

  remove: ->

  viewportRelativeMotion: ({ x, y, offsetY, speed }) ->
    @_speed = speed
    if x? and y?
      @_startLocation = { x, y }
      vpx = Crafty.viewport.width / 4

      sx = x + ((x - vpx) * (@_speed - 1)) - (vpx * (@_speed - 1))
      newX = sx + (@dx || 0)

      sy = y + calculateY(offsetY, @_speed)
      newY = sy - (@dy || 0)

      @attr x: Math.floor(newX), y: Math.floor(newY)

    @motion = Crafty.bind 'CameraMove', (coords) =>
      x = - (coords.dx * @_speed)
      y = - calculateY(coords.dy, @_speed)

      #newX = @_location.sx - shifted + @dx
      #newY = @_location.sy - (-coords.y * (1 - ((@_speed - 0.225) * 1.2))) + @dy
      @shift x, y
    this

  remove: ->
    Crafty.unbind 'CameraMove', @motion
