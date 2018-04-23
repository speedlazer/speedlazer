{ isPaused } = require('src/lib/core/pauseToggle')

Crafty.c 'PlayerControlledCube',
  init: ->
    @requires '2D, WebGL, Color, Listener, Collision, SunBlock, PlayerControlledShip, Acceleration, InventoryWeapons'
    @attr w: 40, h: 40

    @bind 'Move', (from) ->
      if @hit('Edge') or @hit('Solid') # Contain player within playfield
        delta = @motionDelta()
        @shift(- delta.x, - delta.y)

    @primaryWeapon = undefined
    @primaryWeapons = []
    @secondaryWeapon = undefined
    @superUsed = 0
    @weaponsEnabled = yes
    @currentRenderedSpeed = 0

  start: ->
    @addComponent('Invincible').invincibleDuration(2000)

    @onHit 'Enemy', (collision) ->
      return if isPaused()
      return if @has('Invincible')
      hit = no
      for e in collision
        hit = yes unless e.obj.hidden
      @trigger('Hit') if hit

    @onHit 'PowerUp', (e) ->
      return if isPaused()
      for pu in e
        @pickUp(pu.obj)
        @trigger('PowerUp', pu.obj)

    @bind 'Hit', ->
      @trigger 'Destroyed', this

    @bind 'CameraPan', ({ dx, dy }) ->
      @shift(-dx, -dy)

    @bind 'GameLoop', (fd) ->
      motionX = (@_currentSpeed.x / 1000.0) * fd.dt
      motionY = (@_currentSpeed.y / 1000.0) * fd.dt
      @updateAcceleration()

      #@x += motionX
      #@y += motionY
      ## Move player back if flying into an object
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
    if @installItem powerUp.settings
      @trigger('PowerUp', powerUp.settings)
      powerUp.pickup()

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

