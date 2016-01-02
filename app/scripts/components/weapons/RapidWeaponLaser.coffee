Crafty.c 'RapidWeaponLaser',
  init: ->
    @requires '2D,WebGL,Color'
    @color '#808080'
    @attr
      w: 30
      h: 5

  remove: ->
    @unbind 'GameLoop', @_autoFire

  install: (@ship) ->
    @xp = 0
    @level = @determineLevel @xp
    @attr
      x: @ship.x + 10
      y: @ship.y + 15
      z: @ship.z + 1
    @ship.attach this

    @shooting = no
    @lastShot = 0
    @cooldown = 250
    @shotsFired = 0
    @burstCount = Infinity
    @frontFire = yes

    @bind 'GameLoop', @_autoFire

  addXP: (amount) ->
    @xp += amount
    level = @level
    @level = @determineLevel @xp
    if level isnt @level
      @cooldown = switch @level
        when 0 then 250
        when 1 then 200
        when 2 then 150
        when 3 then 100
      @trigger 'levelUp', @level

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
      if @frontFire
        @_createFrontBullet()
      else
        @_createBackBullet()
      @frontFire = !@frontFire
      @lastShot = 0
      @shotsFired += 1

  _createFrontBullet: ->
    settings = switch @level
      when 0 then w: 6, speed: 550, h: 4
      when 1 then w: 10, speed: 555, h: 4
      when 2 then w: 14, speed: 560, h: 4
      when 3 then w: 18, speed: 565, h: 4

    Crafty.e('Bullet, IgnoreSun')
      .attr
        x: @x + @w
        y: @y + (@h / 2) - (settings.h / 2) + 1
        w: settings.w
        h: settings.h
      .fire
        origin: this
        damage: 100
        speed: @ship._forcedSpeed.x + settings.speed
        direction: 0
      .bind 'HitTarget', (target) =>
        @addXP(1)
        @ship.trigger('BulletHit', target)
      .bind 'DestroyTarget', (target) =>
        @addXP(5)
        @ship.trigger('BulletDestroyedTarget', target)

  _createBackBullet: ->
    settings = switch @level
      when 0 then w: 5, speed: 550, h: 3
      when 1 then w: 8, speed: 555, h: 3
      when 2 then w: 10, speed: 560, h: 3
      when 3 then w: 14, speed: 565, h: 3

    Crafty.e('Bullet, IgnoreSun')
      .attr
        x: @x + @w
        y: @y + (@h / 2) - (settings.h / 2) - 2
        w: settings.w
        h: settings.h
      .fire
        origin: this
        damage: 100
        speed: @ship._forcedSpeed.x + settings.speed
        direction: 0
      .bind 'HitTarget', (target) =>
        @addXP(1)
        @ship.trigger('BulletHit', target)
      .bind 'DestroyTarget', (target) =>
        @addXP(5)
        @ship.trigger('BulletDestroyedTarget', target)

