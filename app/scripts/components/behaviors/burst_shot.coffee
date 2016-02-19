Crafty.c 'BurstShot',
  remove: ->
    @unbind('GameLoop', @_checkForShot)

  burstShot: (options) ->
    @shootConfig =  _.defaults(options,
      targetType: 'PlayerControlledShip'
      burstCooldown: 800
      cooldown: 200
      burstAmount: 10
    )
    @currentBurst = 0
    @bind('GameLoop', @_checkForShot)

  _checkForShot: (fd) ->
    if @lastShotAt?
      @lastShotAt += fd.dt
      if @shootConfig.burstAmount <= @currentBurst
        return if @lastShotAt < @shootConfig.burstCooldown
        @currentBurst = 0
      else
        return if @lastShotAt < @shootConfig.cooldown
    angle = 0
    @_shoot(angle) if @currentBurst < @shootConfig.burstAmount

  _shoot: (angle) ->
    return if @hidden and !@shootConfig.shootWhenHidden
    @lastShotAt = 0
    @currentBurst += 1
    wo = @weaponOrigin ? [0, 0]
    wo[0] *= (@scale ? 1)
    wo[1] *= (@scale ? 1)

    @shootConfig.projectile(wo[0] + @x, wo[1] + @y, angle)
