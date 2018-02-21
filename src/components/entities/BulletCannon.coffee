defaults = require('lodash/defaults')

Crafty.c 'BulletCannon',
  init: ->
    @requires 'Enemy, turretFoot'
    @attr(
      w: 32
      h: 32
    )
    @bind 'HitFlash', @applyBarrelHitFlash
    #@color('#404040')

  bulletCannon: (attr = {}) ->
    defaultHealth = 1750
    @attr defaults(attr,
      health: defaultHealth
      maxHealth: attr.health ? defaultHealth
      aimSpeed: 90
    )
    @enemy()
    @barrel = Crafty.e('2D, WebGL, mineCannon, TweenPromise, Collision')
    @barrel.attr(
      x: @x - 64
      y: @y - 32
      z: 20
      w: 96
      h: 32
    )
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
    @tip = Crafty.e('2D')
    @tip.attr(
      x: @x - 64
      y: @y - 27
      w: 1
      h: 1
    )
    @barrel.attach(@tip)

    @attach(@barrel)

    this

  applyBarrelHitFlash: (onOff) ->
    if onOff
      @barrel.attr hitFlash: { _red: 255, _green: 255, _blue: 255 }
    else
      @barrel.attr hitFlash: no

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
      when 'start-shooting'
        @tip.addComponent('BurstShot').burstShot
          burstCooldown: 1500
          burstAmount: 6
          angleDeviation: 5
          aim: 0
          cooldown: 50
          projectile: (x, y, angle) =>
            projectile = Crafty.e('Projectile, sphere1, Hostile, Collision')
              .crop(6, 21, 18, 7)
              .collision(0, 0, 20, 0, 20, 5, 0, 5)
              .flip()
              .attr(
                w: 20
                h: 8
                speed: 350
                damage: 1
              )

            projectile.shoot(x - 5, y + 10, angle)
      when 'stop-shooting'
        @tip.removeComponent('BurstShot')

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

  getProperty: (property) ->
    {
      xStart: @x
      yStart: @y - 24
      angle: @barrel.rotation
    }

