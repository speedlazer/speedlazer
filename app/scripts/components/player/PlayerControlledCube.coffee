Crafty.c 'PlayerControlledCube',
  init: ->
    @requires '2D, WebGL, Color, Listener, Collision, SunBlock, PlayerControlledShip, Acceleration'
    @attr w: 40, h: 40

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

  start: ->
    @addComponent('Invincible').invincibleDuration(2000)

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
      @trigger 'Destroyed', this

    @bind 'GameLoop', (fd) ->
      motionX = (@_currentSpeed.x / 1000.0) * fd.dt
      motionY = (@_currentSpeed.y / 1000.0) * fd.dt
      @updateAcceleration()

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

  forcedSpeed: (speed, options) ->
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
    if @installItem contents
      Crafty.audio.play('powerup')
      powerUp.destroy()

  installItem: (item) ->
    return unless item?
    if item.type is 'weapon'
      return if @hasItem item.contains
      @items.push item

      if item.contains is 'lasers'
        @_installPrimary 'RapidWeaponLaser'
        return true

      if item.contains is 'oldlasers'
        @_installPrimary 'OldWeaponLaser'
        return true

      if item.contains is 'diagonals'
        @_installPrimary 'RapidDiagonalLaser'
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
    @primaryWeapon = null
    w.destroy() for w in @primaryWeapons
    @primaryWeapons = []
    @items = []

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

