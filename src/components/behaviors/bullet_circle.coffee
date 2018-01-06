defaults = require('lodash/defaults')

Crafty.c 'BulletCircle',

  bulletCircle: (options) ->
    @shootConfig =  defaults(options,
      burstAmount: 10
      angle: 'random'
    )
    this

  shootRing: (config = {}) ->
    settings = defaults(config, @shootConfig)
    return if @hidden and !settings.shootWhenHidden
    @lastShotAt = 0
    @currentBurst += 1
    wo = @weaponOrigin || settings.weaponOrigin || [@w / 2, @h / 2]
    wo[0] *= (@scale ? 1)
    wo[1] *= (@scale ? 1)

    angleRange = 360 / settings.burstAmount
    ang = if settings.angle == 'random'
      Math.random()
    else
      settings.angle
    startAngle = ang * angleRange

    for i in [0...settings.burstAmount]
      settings.projectile(
        wo[0] + @x,
        wo[1] + @y,
        startAngle + (i * angleRange)
      )
