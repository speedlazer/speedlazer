Crafty.c 'RapidWeaponLaser',
  init: ->
    @requires '2D,WebGL,Color'
    @color '#808080'
    @attr
      w: 30
      h: 5

    @stats =
      rapid: 0
      damage: 0

    @lastShot = 0
    @shotsFired = 0
    @burstCount = Infinity
    @frontFire = yes

  remove: ->
    @unbind 'GameLoop', @_autoFire

  install: (@ship) ->
    @attr
      x: @ship.x + 15
      y: @ship.y + 26
      z: @ship.z + 1
      alpha: 0
    @ship.attach this

    @shooting = no
    @_determineWeaponSettings()

    @bind 'GameLoop', @_autoFire

  uninstall: ->
    @attr alpha: 0
    @unbind 'GameLoop', @_autoFire

  upgrade: (aspect) ->
    @stats[aspect] += 1

    @_determineWeaponSettings()
    @trigger('levelUp', aspect: aspect, level: @stats[aspect])

  _determineWeaponSettings: ->
    @cooldown = 200 - (@stats.rapid * 10)
    @damage = 100 + (@stats.damage * 25)

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
      Crafty.audio.play('shoot', 1, .05)
      @frontFire = !@frontFire
      @lastShot = 0
      @shotsFired += 1

  _createFrontBullet: ->
    settings =
      w: 6, speed: 650, h: 3 + @stats.damage, o: @stats.damage

    Crafty.e('Bullet')
      .attr
        x: @x + @w
        y: @y + (@h / 2) - (settings.h / 2) + 1 + settings.o
        w: settings.w
        h: settings.h
        z: 1
      .fire
        origin: this
        damage: @damage
        speed: @ship._currentSpeed.x + settings.speed
        direction: 0
      .bind 'HitTarget', (target) =>
        @ship.trigger('BulletHit', target)
      .bind 'DestroyTarget', (target) =>
        @ship.trigger('BulletDestroyedTarget', target)

  _createBackBullet: ->
    settings =
      w: 5, speed: 650, h: 2 + @stats.damage, o: @stats.damage

    Crafty.e('Bullet')
      .attr
        x: @x + @w
        y: @y + (@h / 2) - (settings.h / 2) - 2 - settings.o
        w: settings.w
        h: settings.h
        z: -1
      .fire
        origin: this
        damage: @damage
        speed: @ship._currentSpeed.x + settings.speed
        direction: 0
      .bind 'HitTarget', (target) =>
        @ship.trigger('BulletHit', target)
      .bind 'DestroyTarget', (target) =>
        @ship.trigger('BulletDestroyedTarget', target)

