Crafty.c 'PlayerControlledShip',
  init: ->
    @requires '2D, WebGL, Color, Collision, Listener'
    @attr w: 30, h: 30
    @bind 'Moved', (from) ->
      if @hit('Edge') or @hit('Solid') # Contain player within playfield
        setBack = {}
        setBack[from.axis] = from.oldValue
        @attr setBack
    @_forcedSpeed =
      x: 0
      y: 0
    @primaryWeapon = undefined
    @secondaryWeapon = undefined
    @superUsed = 0
    @weaponsEnabled = yes

  start: ->
    @addComponent('Invincible').invincibleDuration(2000)
    @onHit 'Enemy', (collision) ->
      return if @has('Invincible')
      hit = no
      for e in collision
        hit = yes unless e.obj.hidden
      @trigger('Hit') if hit

    @onHit 'PowerUp', (e) ->
      for pu in e
        @pickUp(pu.obj)
        @trigger('PowerUp', pu.obj)

    @bind 'GameLoop', (fd) ->
      motionX = (@_forcedSpeed.x / 1000.0) * fd.dt
      motionY = (@_forcedSpeed.y / 1000.0) * fd.dt
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

  secondary: (onOff) ->

  superWeapon: (onOff) ->
    return unless onOff
    @superUsed += 1

  pickUp: (powerUp) ->
    contents =  powerUp.settings.contains
    if @installItem contents
      powerUp.destroy()

  installItem: (item) ->
    if @hasItem item
      if item is 'lasers'
        @primaryWeapon.addXP(100)
      if item is 'diagonals'
        @secondaryWeapon.addXP(100)
      return true
    @items.push item
    if item is 'oldlasers'
      @primaryWeapon?.destroy()

      @primaryWeapon = Crafty.e('OldWeaponLaser')
      @primaryWeapon.install(this)
      @listenTo @primaryWeapon, 'levelUp', (level) =>
        @scoreText "L +#{level}"
      return true
    if item is 'lasers'
      @primaryWeapon?.destroy()

      @primaryWeapon = Crafty.e('RapidWeaponLaser')
      @primaryWeapon.install(this)
      @listenTo @primaryWeapon, 'levelUp', (level) =>
        @scoreText "L +#{level}"
      return true
    if item is 'diagonals'
      @secondaryWeapon?.destroy()

      @secondaryWeapon = Crafty.e('RapidDiagonalLaser')
      @secondaryWeapon.install(this)
      @listenTo @secondaryWeapon, 'levelUp', (level) =>
        @scoreText "D +#{level}"
      return true

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


