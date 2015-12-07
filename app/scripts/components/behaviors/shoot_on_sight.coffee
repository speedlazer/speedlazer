Crafty.c 'ShootOnSight',
  init: ->
    @bind('EnterFrame', @_checkForShot)

  remove: ->
    @unbind('EnterFrame', @_checkForShot)

  _checkForShot: (fd) ->
    if @lastShotAt?
      @lastShotAt += fd.dt
      return if @lastShotAt < 1000
    self = this
    Crafty('PlayerControlledShip').each ->
      angle = Math.atan2(self.y - @y, self.x - @x)
      angle *= 180 / Math.PI
      self._shoot(angle + 180) if Math.abs(angle - self.rotation) < 0.5

  _shoot: (angle) ->
    return if @hidden
    @lastShotAt = 0
    Crafty.e('2D, Canvas, Enemy, Color, ViewportFixed').attr(
      x: @x
      y: @y
      w: 4
      h: 4
      speed: 250
      rotation: angle
    ).color('#FFFF00').bind('EnterFrame', (fd) ->
      dist = fd.dt * (@speed / 1000)
      @x += Math.cos(@rotation / 180 * Math.PI) * dist
      @y += Math.sin(@rotation / 180 * Math.PI) * dist
      if @x < -Crafty.viewport.x || @x > -Crafty.viewport.x + Crafty.viewport.width
        @destroy()
      if @y < -Crafty.viewport.y || @y > -Crafty.viewport.y + Crafty.viewport.height
        @destroy()

    )
