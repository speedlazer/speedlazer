Crafty.c 'Projectile',
  init: ->
    @requires '2D, WebGL, ViewportFixed'

  shoot: (x, y, angle) ->
    @attr(
      x: x,
      y: y,
      rotation: angle
    )
    @bind('GameLoop', (fd) ->
      dist = fd.dt * (@speed / 1000)
      @x -= Math.cos(@rotation / 180 * Math.PI) * dist
      @y -= Math.sin(@rotation / 180 * Math.PI) * dist
      if @x < -Crafty.viewport.x || @x > -Crafty.viewport.x + Crafty.viewport.width
        @destroy()
      if @y < -Crafty.viewport.y || @y > -Crafty.viewport.y + Crafty.viewport.height
        @destroy()
    )
    this
