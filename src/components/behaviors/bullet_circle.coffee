Crafty.c 'BulletCircle',

  bulletCircle: (options) ->
    @shootConfig =  _.defaults(options,
      burstAmount: 10
    )
    this

  shootRing: ->
    return if @hidden and !@shootConfig.shootWhenHidden
    @lastShotAt = 0
    @currentBurst += 1
    wo = @weaponOrigin || @shootConfig.weaponOrigin || [@w / 2, @h / 2]
    wo[0] *= (@scale ? 1)
    wo[1] *= (@scale ? 1)

    angleRange = 360 / @shootConfig.burstAmount
    startAngle = Math.random() * angleRange

    for i in [0...@shootConfig.burstAmount]
      @shootConfig.projectile(
        wo[0] + @x,
        wo[1] + @y,
        startAngle + (i * angleRange)
      )
