defaults = require('lodash/defaults')

Crafty.c 'MineCannon',
  init: ->
    @requires 'Enemy, Color'
    @attr(
      w: 32
      h: 32
    )
    @color('#404040')

  mineCannon: (attr = {}) ->
    defaultHealth = 1750
    @attr defaults(attr,
      health: defaultHealth
      maxHealth: attr.health ? defaultHealth
      aimSpeed: 45
    )
    @barrel = Crafty.e('2D, WebGL, Color, TweenPromise, Collision')
    @barrel.attr(
      x: @x - 64
      y: @y - 16
      z: 11
      w: 96
      h: 32
    ).color('#505050')
    @barrel.origin(@barrel.w - 16, 16)
    @barrel.onHit(
      'Bullet',
      (e) => @onProjectileHit(e)
      => @onProjectileHitEnd()
    )
    @barrel.onHit(
      'Explosion'
      (e) => @onExplosionHit(e)
      => @onProjectileHitEnd()
    )

    @attach(@barrel)

    @enemy()
    this

  updatedHealth: ->
    healthPerc = @health / @maxHealth
    if healthPerc < .01
      @barrel.attr(alpha: 0)
    else
      @barrel.attr(alpha: 1)

  execute: (action, args, level) ->
    switch action
      when 'aim'
        @aimAt(level.player('anyActive'))

  aimAt: (player) ->
    angle = @aimAngle(player)
    if angle is null
      return WhenJS().delay(1000).then =>
        @aimAt(player)
    if angle < -80
      angle = (angle + 360) % 360

    duration = Math.abs(@barrel.rotation - angle) * 1000 / @aimSpeed
    @barrel.tweenPromise(rotation: angle, duration)

  aimAngle: (player) ->
    target = player.ship()
    return null if target is null
    b = [@barrel.x + @barrel._origin.x, @barrel.y + @barrel._origin.y]
    t = [target.x + (target.w / 2), target.y + (target.h / 2)]
    Math.atan2(b[1] - t[1], b[0] - t[0]) * 180 / Math.PI

  get: (property) ->
    {
      xStart: @x
      yStart: @y
      angle: @barrel.rotation
    }

