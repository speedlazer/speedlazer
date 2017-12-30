defaults = require('lodash/defaults')

Crafty.c 'LargeDrone',
  init: ->
    @requires 'Enemy, standardLargeDrone, SpriteAnimation'

  drone: (attr = {}) ->
    defaultHealth = 360000
    @crop 0, 0, 90, 70
    @attr defaults(attr,
      health: defaultHealth
      maxHealth: attr.health ? defaultHealth
      z: -1
    )
    @origin 'center'
    @collision [2, 36, 16,15, 86,2, 88,4, 62,15, 57,46, 46, 66, 18, 66, 3, 47]

    @eye = Crafty.e('2D, WebGL, eyeStart, SpriteAnimation')
    @eye.crop(0, 0, 20, 26)
    @attach(@eye)
    @eye.attr(x: 2 + @x, y: 18 + @y, z: 1)
    @eye.reel 'slow', 1500, [
      [6, 0], [7, 0], [8, 0], [9, 0],
      [6, 1], [7, 1], [8, 1], [9, 1]
    ]
    @eye.reel 'medium', 500, [
      [6, 0], [7, 0], [8, 0], [9, 0],
      [6, 1], [7, 1], [8, 1], [9, 1]
    ]
    @eye.reel 'fast', 250, [
      [6, 0], [7, 0], [8, 0], [9, 0],
      [6, 1], [7, 1], [8, 1], [9, 1]
    ]

    @wing = Crafty.e('2D, WebGL, wingLoaded, SpriteAnimation')
    @wing.crop(0, 0, 46, 21)
    @attach(@wing)
    @wing.attr(x: 19 + @x, y: 28 + @y, z: 1, h: 21, w: 46)
    @wing.reel 'emptyWing', 30, [[14, 2, 2, 1]]
    @wing.reel 'reload', 500, [
      [6, 2, 2, 1], [8, 2, 2, 1],
      [10, 2, 2, 1], [12, 2, 2, 1]
    ]

    @enemy()
    @onHit 'Mine', (e) ->
      return if Game.paused
      return if @hidden
      for c in e
        mine = c.obj
        return if mine.hidden
        return if mine.z < 0
        mine.absorbDamage(300) # Mine collision on LargeDrone triggers explosion of mine
    @updatedHealth()
    @bind 'Hit', (data) =>
      if data.projectile.has('Bullet')
        Crafty.audio.play('hit', 1, .5)
        Crafty.e('Blast, LaserHit').explode(
          x: data.projectile.x
          y: data.projectile.y
          z: @z + 2
          radius: 4
          duration: 50
        )
    this

  healthBelow: (perc) ->
    (@health / @maxHealth) < perc

  updatedHealth: ->
    healthPerc = @health / @maxHealth

    return @sprite(9, 8, 3, 3) if healthPerc < .3
    return @sprite(6, 8, 3, 3) if healthPerc < .6
    return @sprite(3, 8, 3, 3) if healthPerc < .9
    @sprite(0, 8, 3, 3)

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    @vx = dx * (1000 / dt)
    @vy = dy * (1000 / dt)
