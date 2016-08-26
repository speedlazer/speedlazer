Crafty.c 'PlayerSpaceship',
  init: ->
    @requires '2D, WebGL, playerShip, ColorEffects, Listener, Collision, SunBlock, WaterSplashes, PlayerControlledShip, Acceleration'
    @attr w: 71, h: 45
    @collision [
      21, 13
      56, 13
      66, 32
      35, 32
    ]

    @bind 'Moved', (from) ->
      if @hit('Edge') or @hit('Solid') # Contain player within playfield
        setBack = {}
        setBack[from.axis] = from.oldValue
        @attr setBack
    @primaryWeapon = undefined
    @primaryWeapons = []
    @secondaryWeapon = undefined
    @superUsed = 0
    @weaponsEnabled = yes
    @currentRenderedSpeed = 0
    @flip('X')

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    velocity = Math.max(dx * (1000 / dt), 0)
    @_updateFlyingSpeed velocity, dt

  _updateFlyingSpeed: (newSpeed, dt) ->
    if newSpeed < 50
      correction = newSpeed / 2
    else
      correction = 25 + ((newSpeed / 400) * 100)

    if @currentRenderedSpeed > correction
      @currentRenderedSpeed -= 12
    else if @currentRenderedSpeed < correction
      @currentRenderedSpeed += 12
    if @currentRenderedSpeed < 0
      @currentRenderedSpeed = 0

    w = @currentRenderedSpeed

    h = Math.min(w / 3, 15)
    @backFire.attr(
      x: @x - w + 9
      y: @y + 20 - (h // 2)
      w: w
      h: h
    )

  start: ->
    @backFire = Crafty.e('2D, WebGL, shipEngineFire, ColorEffects')
      .crop(28, 0, 68, 29)
    @backFire.timing = 0
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

    @backFire.colorOverride(c)

    @addComponent('Invincible').invincibleDuration(2000)

    @setDetectionOffset 40, 0
    @onHit 'Enemy', (collision) ->
      return if Game.paused
      return if @has('Invincible')
      hit = no
      for e in collision
        hit = yes unless e.obj.hidden
      @trigger('Hit') if hit

    @onHit 'PowerUp', (e) ->
      return if Game.paused
      for pu in e
        @pickUp(pu.obj) unless pu.obj.pickedUp

    @bind 'Hit', ->
      Crafty.e('Blast, Explosion').explode(
        x: @x + (@w / 2)
        y: @y + (@h / 2)
        radius: @w
      )
      Crafty.audio.play("explosion")
      Crafty('ScrollWall').get(0).screenShake(10, 1000)
      @trigger 'Destroyed', this

    @bind 'GameLoop', (fd) ->
      if @has 'AnimationMode'
        if @_choreography?.length is 0
          @_updateFlyingSpeed @_currentSpeed.x, fd.dt
        return

      motionX = (@_currentSpeed.x / 1000.0) * fd.dt
      motionY = (@_currentSpeed.y / 1000.0) * fd.dt

      shipSpeedX = @_currentSpeed.x + @vx
      shipSpeedY = @_currentSpeed.y + @vy
      @updateAcceleration()

      r = @rotation
      newR = shipSpeedY / 40
      nr = r
      if r < newR
        nr += 1
      else if r > newR
        nr -= 1

      @rotation = nr
      nr = r if @hit('Edge') or @hit('Solid')

      @rotation = 0
      @_updateFlyingSpeed shipSpeedX, fd.dt
      @rotation = nr

      @x += motionX
      @y += motionY
      # Move player back if flying into an object
      if @hit('Edge') or @hit('Solid')
        @x -= motionX
        @y -= motionY

      # still hitting an object? then we where forced in
      # and are crashed (squashed probably)
      @trigger('Hit') if @hit('Edge') or @hit('Solid')

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

  stats: (newStats = {}) ->
    # TODO: Needs refactoring
    if newStats.primary?
      @primaryWeapon.stats = newStats.primary.stats
      #@primaryWeapon.boosts = newStats.primary.boosts
      #@primaryWeapon.boostTimings = newStats.primary.boostTimings
      @primaryWeapon._determineWeaponSettings()

    stats = {}
    stats['primary'] = {
      stats: @primaryWeapon?.stats ? {}
      boosts: @primaryWeapon?.boosts ? {}
      boostTimings: @primaryWeapon?.boostTimings ? {}
    }

    stats

  superWeapon: (onOff) ->
    return unless onOff
    @superUsed += 1

  pickUp: (powerUp) ->
    contents =  powerUp.settings.contains
    if @installItem powerUp.settings
      Crafty.audio.play('powerup')
      @trigger('PowerUp', powerUp.settings)
      powerUp.pickup()

  installItem: (item) ->
    return unless item?
    if item.type is 'weapon'
      return if @hasItem item.contains
      @items.push item

      if item.contains is 'lasers'
        @_installPrimary 'RapidWeaponLaser'
        return true

    if item.type is 'ship'
      if item.contains is 'life'
        @scoreText 'Extra life!'
        return true
      if item.contains is 'points'
        @scoreText '+500 points!'
        return true

    if item.type is 'weaponUpgrade'
      @primaryWeapon.upgrade item.contains
      return true

    if item.type is 'weaponBoost'
      @primaryWeapon.boost item.contains
      return true

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
    settings = _.defaults(settings,
      positive: yes
      location: { @x, @y }
      attach: yes
      duration: 1000
      distance: 70
    )

    location = settings.location?()
    location = {
      x: location.x - Crafty.viewport.x
      y: location.y - Crafty.viewport.y
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
    else
      t.addComponent('ViewportFixed')
    t.delay(
      =>
        @detach(t) if settings.attach
        t.tween(rotation: 0, y: t.y - settings.distance, alpha: 0.5, settings.duration, 'easeInQuad')
        t.one('TweenEnd', -> t.destroy())
      400
    )

