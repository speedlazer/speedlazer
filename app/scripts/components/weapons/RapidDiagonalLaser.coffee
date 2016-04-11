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
      x: @ship.x + 20
      y: @ship.y + 30
      z: @ship.z + 1
      alpha: 0
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
      when 0 then 200
      when 1 then 150
      when 2 then 75
      when 3 then 75

  determineLevel: (xp) ->
    levelBoundaries = [1500, 6000, 24000, 96000]
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
      angle = switch @level
        when 0 then 5
        when 1 then 7
        when 2 then 12
        when 3 then 12
      f = if ((@shotsFired % 2) is 0) then 1 else -1
      deviation = (Math.random() * 1.5)
      @_createAngleBullet(0 + (deviation * f))

      deviation = (Math.random() * 1.5)
      @_createAngleBullet(angle + (deviation * f))

      deviation = (Math.random() * 1.5)
      @_createAngleBullet(-angle + (deviation * f))

      Crafty.audio.play('shoot', 1, .10)
      @frontFire = !@frontFire
      @lastShot = 0
      @shotsFired += 1

  _createAngleBullet: (angle) ->
    settings = switch @level
      when 0 then w: 5, speed: 550, h: 5
      when 1 then w: 6, speed: 555, h: 5
      when 2 then w: 8, speed: 560, h: 5
      when 3 then w: 10, speed: 565, h: 5

    Crafty.e('Bullet')
      .attr
        x: @x + @w
        y: @y + (@h / 2) - (settings.h / 2) + 1
        w: settings.w
        h: settings.h
        rotation: angle
      .fire
        origin: this
        damage: 100
        speed: @ship._currentSpeed.x + settings.speed
        direction: angle
      .bind 'HitTarget', (target) =>
        @addXP(1)
        @ship.trigger('BulletHit', target)
      .bind 'DestroyTarget', (target) =>
        @addXP(5)
        @ship.trigger('BulletDestroyedTarget', target)

