Crafty.c 'ShootOnSight',
  remove: ->
    @unbind('GameLoop', @_checkForShot)

  shootOnSight: (options) ->
    @shootConfig =  _.defaults(options,
      targetType: 'PlayerControlledShip'
      sightAngle: 10
      shootWhenHidden: no
      cooldown: 800
    )

    @bind('GameLoop', @_checkForShot)

  _checkForShot: (fd) ->
    if @lastShotAt?
      @lastShotAt += fd.dt
      return if @lastShotAt < @shootConfig.cooldown

    self = this
    Crafty(@shootConfig.targetType).each ->
      angle = Math.atan2(self.y - @y, self.x - @x)
      angle *= 180 / Math.PI
      angle = (angle + 360) % 360
      self._shoot(angle) if Math.abs(angle - self.rotation) < self.shootConfig.sightAngle

  _shoot: (angle) ->
    return if @hidden and !@shootConfig.shootWhenHidden
    @lastShotAt = 0
    wo = @weaponOrigin ? [0, 0]
    wo[0] *= (@scale ? 1)
    wo[1] *= (@scale ? 1)

    @shootConfig.projectile(wo[0] + @x, wo[1] + @y, angle)
