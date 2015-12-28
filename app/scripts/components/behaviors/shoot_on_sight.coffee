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
      self._shoot(angle + 180) if Math.abs(angle - self.rotation) < self.shootConfig.sightAngle

  _shoot: (angle) ->
    return if @hidden and !@shootConfig.shootWhenHidden
    @lastShotAt = 0

    @shootConfig.projectile(@x, @y, angle)
