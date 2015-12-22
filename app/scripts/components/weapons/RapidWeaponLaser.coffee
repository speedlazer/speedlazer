Crafty.c 'RapidWeaponLaser',
  init: ->
    @requires '2D,Canvas,Color'
    @color '#808080'
    @attr
      w: 30
      h: 5

  remove: ->
    @unbind 'EnterFrame', @_autoFire

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
    @cooldown = 200
    @shotsFired = 0
    @burstCount = Infinity
    @frontFire = yes

    @bind 'EnterFrame', @_autoFire

  addXP: (amount) ->
    @xp += amount
    level = @level
    @level = @determineLevel @xp
    if level isnt @level
      @cooldown = switch @level
        when 0 then 200
        when 1 then 175
        when 2 then 150
        when 3 then 125
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
      when 0 then w: 6, speed: 350, h: 3
      when 1 then w: 10, speed: 355, h: 4
      when 2 then w: 14, speed: 360, h: 5
      when 3 then w: 18, speed: 365, h: 5

    Crafty.e('Bullet')
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
      .bind 'HitTarget', =>
        @addXP(1)
        @ship.trigger('BulletHit')
      .bind 'DestroyTarget', =>
        @addXP(5)
        @ship.trigger('BulletDestroyedTarget')

  _createBackBullet: ->
    settings = switch @level
      when 0 then w: 5, speed: 350, h: 3
      when 1 then w: 8, speed: 355, h: 3
      when 2 then w: 10, speed: 360, h: 4
      when 3 then w: 14, speed: 365, h: 4

    Crafty.e('Bullet')
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
      .bind 'HitTarget', =>
        @addXP(1)
        @ship.trigger('BulletHit')
      .bind 'DestroyTarget', =>
        @addXP(5)
        @ship.trigger('BulletDestroyedTarget')

