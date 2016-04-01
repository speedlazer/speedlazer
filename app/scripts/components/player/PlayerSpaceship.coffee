Crafty.c 'PlayerSpaceship',
  init: ->
    @requires '2D, WebGL, playerShip, ColorEffects, Listener, Collision, SunBlock, WaterSplashes, PlayerControlledShip'
    @attr w: 71, h: 45
    #@addComponent 'SolidHitBox'
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
    @_forcedSpeed =
      x: 0
      y: 0
    @primaryWeapon = undefined
    @primaryWeapons = []
    @secondaryWeapon = undefined
    @superUsed = 0
    @weaponsEnabled = yes
    @currentRenderedSpeed = 0

  _updateFlyingSpeed: (newSpeed, dt) ->
    if newSpeed < 50
      correction = newSpeed / 2
    else
      correction = 25 + ((newSpeed / 700) * 100)

    if @currentRenderedSpeed > correction
      @currentRenderedSpeed -= 4
    else if @currentRenderedSpeed < correction
      @currentRenderedSpeed += 4
    if @currentRenderedSpeed < 0
      @currentRenderedSpeed = 0

    w = @currentRenderedSpeed

    h = w / 3
    @backFire.attr(
      x: @x - w + 9
      y: @y + 20 - (h // 2)
      w: w
      h: h
    )

  start: ->
    @backFire = Crafty.e('2D, WebGL, shipEngineFire')
    @backFire.timing = 0
    @backFire.attr(
      x: @x - 49
      y: @y + 10
      w: 60
      h: 20
      z: @z - 1
    )
    @attach @backFire

    @addComponent('Invincible').invincibleDuration(2000)

    @setSealevel(Crafty.viewport.height - 20)
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
        @pickUp(pu.obj)
        @trigger('PowerUp', pu.obj)

    @bind 'Hit', ->
      Crafty.e('Blast, Explosion').explode(
        x: @ship.x + (@ship.w / 2)
        y: @ship.y + (@ship.h / 2)
        radius: @ship.w
      )
      Crafty.audio.play("explosion")
      Crafty('ScrollWall').get(0).screenShake(10, 1000)
      @trigger 'Destroyed', this

    @bind 'GameLoop', (fd) ->
      motionX = (@_forcedSpeed.x / 1000.0) * fd.dt
      motionY = (@_forcedSpeed.y / 1000.0) * fd.dt

      shipSpeedX = @_forcedSpeed.x + @vx
      shipSpeedY = @_forcedSpeed.y + @vy
      @_updateFlyingSpeed shipSpeedX, fd.dt

      r = @rotation
      newR = shipSpeedY / 20
      if r < newR
        @rotation += 1
      else if r > newR
        @rotation -= 1
      if @hit('Edge') or @hit('Solid')
        @rotation = r

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

  forcedSpeed: (speed) ->
    if speed.x? && speed.y?
      @_forcedSpeed.x = speed.x
      @_forcedSpeed.y = speed.y
    else
      @_forcedSpeed.x = speed
      @_forcedSpeed.y = 0
    this

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
    if @installItem contents
      Crafty.audio.play('powerup')
      powerUp.destroy()

  installItem: (item) ->
    if item is 'xp'
      @primaryWeapon.addXP(1000)
      return true

    return if @hasItem item

    @items.push item

    # TODO: Add multiple primary weapons, which can be swapped
    # Count XP on current weapon only
    if item is 'lasers'
      @_installPrimary 'RapidWeaponLaser'
      return true

    if item is 'oldlasers'
      @_installPrimary 'OldWeaponLaser'
      return true

    if item is 'diagonals'
      @_installPrimary 'RapidDiagonalLaser'
      return true

  clearItems: ->
    @primaryWeapon?.uninstall()
    for w in @primaryWeapons
      w.destroy()

  _installPrimary: (componentName) ->
    weapon = Crafty.e(componentName)
    weapon.install(this)
    @primaryWeapon?.uninstall()
    @primaryWeapon = weapon
    @listenTo weapon, 'levelUp', (level) =>
      @scoreText "L +#{level}"
    @primaryWeapons.push weapon
    @currentPrimary = @primaryWeapons.length - 1

  hasItem: (item) ->
    @items ?= []
    return ~@items.indexOf item

  scoreText: (text) ->
    Crafty.e('Text, DOM, 2D, Tween')
      .textColor('#FFFFFF')
      .text(text)
      .attr(
        x: @x
        y: @y - 10
        z: 990
        w: 100
      )
      .textFont({
        size: '10px',
        weight: 'bold',
        family: 'Press Start 2P'
      })
      .tween(y: @y - 40, alpha: 0.5, 1000)
      .one('TweenEnd', -> @destroy())


