defaults = require('lodash/defaults')
createEntityPool = require('src/lib/entityPool').default

Crafty.c 'PlayerSpaceship',
  init: ->
    @requires '2D, WebGL, playerShip, ColorEffects, Listener, Collision, SunBlock, ' +
      'WaterSplashes, PlayerControlledShip, Acceleration, InventoryWeapons'
    @attr w: 71, h: 45
    @collision [
      21, 13
      56, 13
      66, 32
      35, 32
    ]

    @onHit 'ShipSolid', (hits) ->
      console.log('on edge!')

      delta = @motionDelta()
      xCorrection = 0
      yCorrection = 0
      xDir = 0
      yDir = 0

      hits.map((hitData) =>
        xHitCorrection = 0
        yHitCorrection = 0
        if hitData.type == 'SAT'
          xHitCorrection -= hitData.overlap * hitData.nx
          yHitCorrection -= hitData.overlap * hitData.ny
        else # MBR
          obj = hitData.obj
          d = obj.choreographyDelta?() || { x: 0, y: 0 }
          if obj.intersect(@x - delta.x, @y, @w, @h)
            yHitCorrection -= delta.y - d.y

          if obj.intersect(@x, @y - delta.y, @w, @h)
            xHitCorrection -= delta.x - d.x

        if xHitCorrection != 0
          if xHitCorrection > 0
            @_squashShip() if xDir < 0
            xDir = 1
            xCorrection = Math.max(xCorrection, xHitCorrection)
          else
            @_squashShip() if xDir > 0
            xDir = -1
            xCorrection = Math.min(xCorrection, xHitCorrection)

        if yHitCorrection != 0
          if yHitCorrection < 0
            @_squashShip() if yDir > 0
            yDir = -1
            yCorrection = Math.min(yCorrection, yHitCorrection)
          else
            @_squashShip() if yDir < 0
            yDir = 1
            yCorrection = Math.max(yCorrection, yHitCorrection)
      )

      @shift(xCorrection, yCorrection)

    @primaryWeapon = undefined
    @primaryWeapons = []
    @secondaryWeapon = undefined
    @superUsed = 0
    @weaponsEnabled = yes
    @currentRenderedSpeed = 0
    @flip('X')
    @emitCooldown = 0

  _squashShip: ->
    @trigger('Hit', { damage: 1000 })

  updateMovementVisuals: (rotation = 0, dx, dy, dt) ->
    velocity = Math.max(dx * (1000 / dt), 0)

    if dy > 0
      if @healthPerc < 0.3
        @sprite(13, 5)
      else
        @sprite(7, 4)
    else if dy < 0
      if @healthPerc < 0.3
        @sprite(13, 3)
      else
        @sprite(10, 4)
    else
      if @healthPerc < 0.3
        @sprite(0, 2)
      else
        @sprite(0, 0)

    @rotation = 0
    @_updateFlyingSpeed velocity, dt
    @rotation = rotation

  _updateFlyingSpeed: (newSpeed, dt) ->
    if newSpeed < 30
      correction = newSpeed / 2
    else
      correction = 15 + ((newSpeed / 400) * 100)

    if @currentRenderedSpeed > correction
      @currentRenderedSpeed -= 12
    else if @currentRenderedSpeed < correction
      @currentRenderedSpeed += 12
    if @currentRenderedSpeed < 0
      @currentRenderedSpeed = 0

    w = 10 + @currentRenderedSpeed

    h = Math.min(w / 3, 15)
    @backFire.attr(
      x: @x - w + 9
      y: @y + 20 - (h // 2)
      w: w
      h: h
    )
    @_emitTrail(dt)

  _emitTrail: (dt) ->
    @emitCooldown -= dt
    if @emitCooldown < 0
      w = @backFire.w / 4
      h = 4
      @trailEntPool.get().attr(
        x: @x - w
        dy: 0
        y: Math.floor(@y + 21 - (Math.random() * 4))
        w: w
        h: h
        z: -4
        alpha: 0.3 + (Math.random() * 0.4)
      ).tweenPromise({ alpha: 0, h: 2, dy: 2 }, 750, 'easeOutQuad').then((e) =>
        @trailEntPool.recycle(e)
      )
      @emitCooldown = 30

  start: ->
    @backFire = Crafty.e('2D, WebGL, shipEngineFire, ColorEffects, SpriteAnimation')
    @backFire.reel 'burn', 300, [[4, 5, 3, 1], [3, 0, 3, 1]]
    @backFire.timing = 0
    @backFire.animate('burn', -1)
    w = 68
    h = 10

    @backFire.attr(
      x: @x - w
      y: @y + 20 - (h // 2)
      w: w
      h: h
      alpha: .8
      z: @z - 1
    )
    @attach @backFire

    c = {}
    basicC = {
      _red: 255
      _green: 255
      _blue: 255
    }
    Crafty.assignColor(@playerColor, c)
    for comp in ['_red', '_green', '_blue']
      newC = (c[comp] + basicC[comp] + basicC[comp]) / 3
      c[comp] = newC

    @trailColor = c
    @backFire.colorOverride(c)
    @trailEntPool = createEntityPool(
      =>
        Crafty.e(
          '2D, WebGL, shipEngineFire, Delta2D, TweenPromise, ViewportRelativeMotion, ColorEffects'
        ).colorOverride(
          @trailColor
        ).viewportRelativeMotion(
          speed: 1
        )
      2
    )

    @addComponent('Invincible').invincibleDuration(1500)

    @setDetectionOffset 60
    @onHit('Hostile',
      (collision) ->
        return if Game.paused
        return if @has('Invincible')
        hit = no
        damage = 0
        for e in collision
          if e.obj.damage and e.obj.damage > damage and !e.obj.hidden
            damage = e.obj.damage
            hit = yes
        @trigger('Hit', { damage }) if hit
    )

    @onHit 'PowerUp', (e) ->
      return if Game.paused
      for pu in e
        @pickUp(pu.obj) unless pu.obj.pickedUp

    @bind 'Hit', ->
      @addComponent('Invincible').invincibleDuration(2000)
      Crafty.e('Blast, Explosion').explode(
        x: @x + (@w / 2)
        y: @y + (@h / 2)
        radius: @w / 3
      )
      Crafty.audio.play("explosion")
      Crafty('ScrollWall').get(0).addTrauma(0.3)

    @bind 'Die', ->
      Crafty.e('Blast, Explosion').explode(
        x: @x + (@w / 2)
        y: @y + (@h / 2)
        radius: @w
      )
      Crafty.audio.play("explosion")
      # this trauma is added upon the 'hit'
      Crafty('ScrollWall').get(0).addTrauma(0.3)
      @trigger 'Destroyed', this

    @bind 'CameraPan', ({ dx, dy }) ->
      @shift(-dx, -dy)

    @bind 'GameLoop', (fd) ->
      motionX = ((@vx + @_currentSpeed.x) / 1000.0) * fd.dt
      motionY = ((@vy + @_currentSpeed.y) / 1000.0) * fd.dt

      if @has 'AnimationMode'
        if @_choreography?.length is 0
          @updateMovementVisuals(@rotation, motionX, motionY, fd.dt)
        return

      @updateAcceleration()

      r = @rotation
      newR = motionY
      nr = r
      if r < newR
        nr += 1
      else if r > newR
        nr -= 1

      @rotation = nr
      @updateMovementVisuals(@rotation, motionX, motionY, fd.dt)

    this

  forcedSpeed: (speed, options = {}) ->
    @targetSpeed(speed, options)

  shoot: (onOff) ->
    return unless @weaponsEnabled

    if @primaryWeapon?
      @primaryWeapon.shoot(onOff)

    if @secondaryWeapon?
      @secondaryWeapon.shoot(onOff)

  switchWeapon: (onOff) ->
    return unless onOff
    nextWeapon = (@currentPrimary + 1) % @primaryWeapons.length
    @primaryWeapon?.uninstall()
    @primaryWeapon = @primaryWeapons[nextWeapon]
    @primaryWeapon.install(this)
    @currentPrimary = nextWeapon

  superWeapon: (onOff) ->
    return unless onOff
    @superUsed += 1

  pickUp: (powerUp) ->
    contents =  powerUp.settings.contains
    if @installItem powerUp.settings
      Crafty.audio.play('powerup')
      @trigger('PowerUp', powerUp.settings)
      powerUp.pickup()

  clearItems: ->
    @primaryWeapon?.uninstall()
    w.destroy() for w in @primaryWeapons
    @primaryWeapons = []
    @items = []

  _installPrimary: (componentName) ->
    weapon = Crafty.e(componentName)
    weapon.install(this)
    @primaryWeapon?.uninstall()
    @primaryWeapon = weapon
    @listenTo weapon, 'levelUp', (info) =>
      t =
        damage: 'Damage'
        rapid: 'RapidFire'
        aim: 'AimAssist'
        speed: 'BulletSpeed'
      @scoreText "#{t[info.aspect]} +#{info.level}"
    @listenTo weapon, 'boost', (info) =>
      t =
        damageb: 'Damage'
        rapidb: 'RapidFire'
        aimb: 'AimAssist'
        speedb: 'BulletSpeed'
      @scoreText "#{t[info.aspect]} Boost!"
    @listenTo weapon, 'boostExpired', (info) =>
      t =
        damageb: 'Damage'
        rapidb: 'RapidFire'
        aimb: 'AimAssist'
        speedb: 'BulletSpeed'
      @scoreText "#{t[info.aspect]} Boost expired", positive: no

    @primaryWeapons.push weapon
    @currentPrimary = @primaryWeapons.length - 1

  hasItem: (item) ->
    @items ?= []
    return yes for i in @items when i.contains is item
    no

  scoreText: (text, settings = {}) ->
    settings = defaults(settings,
      positive: yes
      location: { @x, @y }
      attach: yes
      duration: 1000
      distance: 70
      delay: 400
    )

    location = settings.location?()
    location = {
      x: location.x
      y: location.y
    } if location

    location ?= settings.location

    t = Crafty.e('Text, DOM, 2D, Tween, Delay')
      .textColor(if settings.positive then '#DDD' else '#F00')
      .text(text)
      .attr(
        x: location.x
        y: location.y - 10
        z: 990
        w: 250
        alpha: .75
      )
      .textFont({
        size: '10px',
        weight: 'bold',
        family: 'Press Start 2P'
      })
    if settings.attach
      @attach(t)
    t.delay(
      =>
        @detach(t) if settings.attach
        t.tween(rotation: 0, y: t.y - settings.distance, alpha: 0.5, settings.duration, 'easeInQuad')
        t.one('TweenEnd', -> t.destroy())
      settings.delay
    )

  remove: ->
    @trailEntPool.clean()

