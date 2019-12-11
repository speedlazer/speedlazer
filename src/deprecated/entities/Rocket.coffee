defaults = require('lodash/defaults')

Crafty.c 'Rocket',
  init: ->
    @requires 'Enemy, standardRocket'

  rocket: (attr = {}) ->
    @crop(0, 0, 47, 17)
    @attr defaults(attr,
      health: 300)
    @origin 'center'

    @enemy()
    @backFire = Crafty.e(
      "2D, WebGL, shipEngineFire, SpriteAnimation"
    )
    @backFire.reel("burn", 300, [[4, 5, 3, 1], [3, 0, 3, 1]])
    @backFire.timing = 0
    @backFire.animate("burn", -1)
    @backFire.flip('X')
    w = 30
    @backFire.attr({
      x: @x + @w,
      y: @y,
      w
      h: @h
      alpha: 0.7,
      z: @z - 1
    })
    @attach(@backFire)
    this

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    @vx = dx * (1000 / dt)
    @vy = dy * (1000 / dt)
    velocity = Math.sqrt((dx * dx) + (dy * dy))
    @backFire.w = velocity * 10

    @rotation = rotation if rotation?

