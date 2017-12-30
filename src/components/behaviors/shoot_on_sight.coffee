defaults = require('lodash/defaults')
sample = require('lodash/sample')

Crafty.c 'ShootOnSight',
  init: ->
    @requires 'Delay'

  remove: ->
    @unbind('GameLoop', @_checkForShot)

  shootOnSight: (options) ->
    @shootConfig =  defaults(options,
      targetType: 'PlayerControlledShip'
      sightAngle: 10
      shootWhenHidden: no
      cooldown: 800
    )

    wo = @weaponOrigin ? [0, 0]
    wo[0] *= (@scale ? 1)
    wo[1] *= (@scale ? 1)
    unless @muzzleFlash?
      @muzzleFlash = Crafty.e('Sphere')
        .attr(
          x: @x + wo[0]
          y: @y + wo[1]
          alpha: 0
        ).muzzle()
      @attach @muzzleFlash
    @muzzleFlash.attr alpha: 0

    @lastShotAt = 0
    @bind('GameLoop', @_checkForShot)
    @bind('Revealing', =>
      @muzzleFlash.attr alpha: 0
    )

  _checkForShot: (fd) ->
    return if @shooting
    if @lastShotAt?
      @lastShotAt += fd.dt
      return if @lastShotAt < @shootConfig.cooldown

    self = this
    targets = []
    Crafty(@shootConfig.targetType).each ->
      angle = self._determineAngle(this)
      if Math.abs(angle - self.rotation) < self.shootConfig.sightAngle
        targets.push this
    if targets.length > 0
      target = sample(targets)
      @_shoot(target)

  _determineAngle: (entity) ->
    angle = Math.atan2(@y - entity.y, @x - entity.x)
    angle *= 180 / Math.PI
    angle += 180 if @xFlipped
    (angle + 360) % 360

  _shoot: (target) ->
    return if @hidden and !@shootConfig.shootWhenHidden
    @shooting = yes

    @muzzleFlash.attr alpha: 1
    @delay(
      =>
        @lastShotAt = 0
        wo = @weaponOrigin ? [0, 0]
        wo[0] *= (@scale ? 1)
        wo[1] *= (@scale ? 1)

        angle = @_determineAngle(target)
        angle += 180 if @xFlipped
        angle = (angle + 360) % 360

        @shootConfig.projectile(wo[0] + @x, wo[1] + @y, angle)
        @muzzleFlash.attr alpha: 0
        @shooting = no
      300
    )
