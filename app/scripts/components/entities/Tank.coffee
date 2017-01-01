Crafty.c 'Tank',
  init: ->
    @requires 'Enemy, Color, Delay'

  tank: (attr = {}) ->
    defaultHealth = 2750
    @attr _.defaults(attr,
      w: 150
      h: 100
      health: defaultHealth
      maxHealth: attr.health ? defaultHealth
      aimSpeed: 45
    )
    @color '#FF0000'
    @barrel = Crafty.e('2D, WebGL, Color, TweenPromise')
    @barrel.color('#060')
    @barrel.attr(
      x: @x + 20
      y: @y + 20
      z: @z + 1
      w: 100
      h: 20
    )
    @barrel.origin(@barrel.w - 10, 10)

    @charge = Crafty.e('2D, Color, WebGL, TweenPromise')
    @charge.color('#F0F')
    @charge.attr(
      x: @barrel.x - 10
      y: @barrel.y
      w: 10
      h: 20
      alpha: 0
    )
    @charge.origin(@charge.w - 10, 10)

    @laser = Crafty.e('2D, Color, WebGL, TweenPromise')
    @laser.color('#F0F')
    laserLength = 1000
    @laser.attr(
      x: @barrel.x - laserLength
      y: @barrel.y
      w: laserLength
      h: 20
      alpha: 0
    )
    @laser.origin(@laser.w - 10, 10)

    @attach(@barrel)
    @barrel.attach(@charge)
    @barrel.attach(@laser)

    @enemy()
    this

  updatedHealth: ->

  execute: (action, args, level) ->
    switch action
      when 'searchAim'
        @aimAt(level.player('anyActive'))
      when 'shoot'
        @shoot()

  aimAt: (player) ->
    angle = @aimAngle(player)
    if angle is null
      return WhenJS().delay(1000).then =>
        @aimAt(player)
    if angle < -80
      angle = (angle + 360) % 360

    duration = Math.abs(@barrel.rotation - angle) * 1000 / @aimSpeed
    @barrel.tweenPromise(rotation: angle, duration).then =>
      adjusted = Math.abs(@aimAngle(player) - @barrel.rotation)
      @aimAt(player) if adjusted > 10 # Retry

  aimAngle: (player) ->
    target = player.ship()
    return null if target is null
    b = [@barrel.x + @barrel._origin.x, @barrel.y + @barrel._origin.y]
    t = [target.x + (target.w / 2), target.y + (target.h / 2)]
    Math.atan2(b[1] - t[1], b[0] - t[0]) * 180 / Math.PI

  shoot: ->
    # charge
    chargeTime = 500
    fireTime = 100
    @charge.tweenPromise(alpha: 1, chargeTime).then =>
      # fire giant laser
      @charge.attr(alpha: 0)
      @laser.addComponent('Hostile')
      @laser.attr(alpha: 1)
      WhenJS().delay(fireTime).then =>
        @laser.removeComponent('Hostile')
        @laser.attr(alpha: 0)
      # done
