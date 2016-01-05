Crafty.c 'RapidDiagonalLaser',
  init: ->
    @requires '2D,WebGL,Color'
    @color '#d08080'
    @attr
      w: 30
      h: 5
    @xp = 0
    @lastShot = 0
    @shotsFired = 0
    @burstCount = Infinity
    @frontFire = yes

  remove: ->
    @unbind 'GameLoop', @_autoFire

  install: (@ship) ->
    @level = @determineLevel @xp
    @attr
      x: @ship.x + 10
      y: @ship.y + 15
      z: @ship.z + 1
      alpha: 1
    @ship.attach this

    @shooting = no
    @_determineCooldown()

    @bind 'GameLoop', @_autoFire

  uninstall: ->
    @attr alpha: 0
    @unbind 'GameLoop', @_autoFire

  addXP: (amount) ->
    @xp += amount
    level = @level
    @level = @determineLevel @xp
    if level isnt @level
      @_determineCooldown()
      @trigger 'levelUp', @level

  _determineCooldown: ->
    @cooldown = switch @level
      when 0 then 550
      when 1 then 500
      when 2 then 450
      when 3 then 400

  determineLevel: (xp) ->
    levelBoundaries = [150, 600, 2400, 9600]
    neededXP = 0
    level = 0
    for i in levelBoundaries
      neededXP += i
      level += 1 if xp >= neededXP

    progress = (xp - (levelBoundaries[level - 1] ? 0)) / levelBoundaries[level]
    return level

  shoot: (onOff) ->
    if onOff
      @shooting = yes
    else
      @shooting = no
      @shotsFired = 0
      @lastShot = 500

  _autoFire: (fd) ->
    @lastShot += fd.dt
    return unless @shooting
    allowBullet = (@shotsFired < @burstCount)
    return unless @ship.weaponsEnabled
    return unless allowBullet
    if @lastShot > @cooldown
      @_createAngleBullet(0)
      @_createAngleBullet(22)
      @_createAngleBullet(-22)

      @frontFire = !@frontFire
      @lastShot = 0
      @shotsFired += 1

  _createAngleBullet: (angle) ->
    settings = switch @level
      when 0 then w: 4, speed: 450, h: 4
      when 1 then w: 5, speed: 455, h: 5
      when 2 then w: 6, speed: 460, h: 6
      when 3 then w: 8, speed: 465, h: 8

    Crafty.e('Bullet, IgnoreSun')
      .attr
        x: @x + @w
        y: @y + (@h / 2) - (settings.h / 2) + 1
        w: settings.w
        h: settings.h
        rotation: angle
      .fire
        origin: this
        damage: 50
        speed: @ship._forcedSpeed.x + settings.speed
        direction: angle
      .bind 'HitTarget', (target) =>
        @addXP(1)
        @ship.trigger('BulletHit', target)
      .bind 'DestroyTarget', (target) =>
        @addXP(5)
        @ship.trigger('BulletDestroyedTarget', target)

