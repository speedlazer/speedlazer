Crafty.c 'RapidWeaponLaser',
  init: ->
    @requires '2D,WebGL,muzzleFlash,ColorEffects'
    @attr
      w: 30
      h: 16

    @stats =
      rapid: 0
      damage: 0
      aim: 0
      speed: 0
    @boosts = {}
    @boostTimings = {}

    @lastShot = 0
    @shotsFired = 0
    @burstCount = Infinity
    @frontFire = yes

  remove: ->
    @unbind 'GameLoop', @_autoFire

  install: (@ship) ->
    c = {}
    basicC = {
      _red: 255
      _green: 255
      _blue: 255
    }
    Crafty.assignColor(@ship.playerColor, c)
    for comp in ['_red', '_green', '_blue']
      newC = (c[comp] + basicC[comp] + basicC[comp]) / 3
      c[comp] = newC

    @colorOverride(c)

    @attr
      x: @ship.x + 38
      y: @ship.y + 22
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

  boost: (aspect) ->
    @boosts[aspect] = 10
    @boostTimings[aspect] = 15 * 1000

    @_determineWeaponSettings()
    @trigger('boost', aspect: aspect)

  _determineWeaponSettings: ->
    @cooldown = 175 - ((@boosts.rapidb || @stats.rapid) * 10)

    @damage = 100 + ((@boosts.damageb || @stats.damage) * 50)

    @aimAngle = 0 + ((@boosts.aimb || @stats.aim) * 6)
    @aimDistance = Math.min(40 + ((@boosts.aimb || @stats.aim) * 50), 500)

    @speed = 650 + ((@boosts.speedb || @stats.speed) * 70)

    levels = (value for k, value of @stats when k isnt 'damage')
    @overallLevel = Math.min(levels...)

  shoot: (onOff) ->
    if onOff
      @shooting = yes
      @attr alpha: 0
    else
      @shooting = no
      @_clearPicked()
      @shotsFired = 0
      @lastShot = 500

  _autoFire: (fd) ->
    @lastShot += fd.dt
    for k, v of @boostTimings
      @boostTimings[k] -= fd.dt
      if v < 0
        delete @boostTimings[k]
        delete @boosts[k]
        @_determineWeaponSettings()
        @trigger('boostExpired', aspect: k)

    @attr alpha: 0 if @lastShot >= 60
    return unless @shooting
    allowBullet = (@shotsFired < @burstCount)
    return unless @ship.weaponsEnabled
    return unless allowBullet
    if @lastShot > @cooldown
      if @frontFire
        @_createFrontBullet()
        # Show muzzle flash
        @attr alpha: 1
      else
        @_createBackBullet()
      Crafty.audio.play('shoot', 1, .05)

      @frontFire = !@frontFire
      @lastShot = 0
      @shotsFired += 1

  _createFrontBullet: ->
    settings =
      w: (@speed // 25), speed: @speed, h: 8 + @overallLevel, o: @overallLevel

    start =
      x: @x + @w
      y: @y + (@h / 2) - (settings.h / 2) + 1 + settings.o
    Crafty.e('Bullet')
      .attr
        w: settings.w
        h: settings.h
        x: start.x
        y: start.y
        z: 1
      .updateCollision(settings.w, settings.h)
      .fire
        ship: @ship
        damage: @damage
        speed: @ship._currentSpeed.x + settings.speed
        direction: @_bulletDirection(start)

  _createBackBullet: ->
    settings =
      w: (@speed // 35), speed: @speed, h: 7 + @overallLevel, o: @overallLevel

    start =
      x: @x + @w
      y: @y + (@h / 2) - (settings.h / 2) - 2 - settings.o
    Crafty.e('Bullet')
      .attr
        w: settings.w
        h: settings.h
        x: start.x
        y: start.y
        z: -1
      .updateCollision(settings.w, settings.h)
      .fire
        ship: @ship
        damage: @damage
        speed: @ship._currentSpeed.x + settings.speed
        direction: @_bulletDirection(start)

  _bulletDirection: (start) ->
    target = @_targetEnemy(start)
    unless target
      @_clearPicked()
      @currentShot = 0
      return 0

    distance = Math.sqrt(Math.abs(start.x - target.x) ** 2 + Math.abs(start.y - target.y) ** 2)
    time = distance / (@speed + @ship._currentSpeed.x)

    projected =
      x: target.x + (target.w // 2) + (target.vx * time)
      y: target.y + (target.h // 2) + (target.vy * time)

    angle = Math.atan2(projected.y - start.y, projected.x - start.x)
    angle *= 180 / Math.PI
    unless -@aimAngle < angle < @aimAngle
      @_clearPicked()
      @currentShot = 0
      return 0

    @currentShot ?= 0
    dist = Math.abs(@currentShot - angle)
    adjust = 2
    if dist > 10
      adjust = 4
    if dist > 15
      adjust = 8
    if dist > 40
      adjust = 25
    if dist > 90
      adjust = 50

    if @currentShot < angle
      @currentShot += adjust
    else
      @currentShot -= adjust

    @currentShot


  _targetEnemy: (start) ->
    return @pickedEntity if @pickedEntity

    list = []
    Crafty('Enemy').each ->
      list.push({ x: @x, y: @y + (@h / 2), e: this }) unless @hidden

    @pickedEntity = null
    pickedDistance = Infinity
    for item in list
      angle = Math.atan2(item.y - start.y, item.x - start.x)
      angle *= 180 / Math.PI
      distance = Math.abs(start.x - item.x) + Math.abs(start.y - item.y)
      if -@aimAngle < angle < @aimAngle
        if distance < pickedDistance
          pickedDistance = distance
          @pickedEntity = item.e
    if @pickedEntity
      @pickedEntity.one 'Remove', => @_clearPicked()
      @pickedEntity.one 'Hiding', => @_clearPicked()

    @pickedEntity

  _clearPicked: ->
    if @pickedEntity
      @pickedEntity.unbind 'Remove', @_clearPicked
      @pickedEntity.unbind 'Hiding', @_clearPicked
    @pickedEntity = null


