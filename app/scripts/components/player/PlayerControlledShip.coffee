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

    @bind 'EnterFrame', (fd) ->
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
    return unless @primaryWeapon?
    @trigger 'Shoot' if onOff
    @primaryWeapon.shoot(onOff)

  secondary: (onOff) ->
    return unless @weaponsEnabled
    return unless @secondaryWeapon?
    #@trigger 'Shoot' if onOff # TODO: What does this do?
    @secondaryWeapon.shoot(onOff)

  pickUp: (powerUp) ->
    contents =  powerUp.settings.contains
    if @installItem contents
      powerUp.destroy()

  installItem: (item) ->
    if @hasItem item
      if item is 'lasers'
        @primaryWeapon.addXP(10)
      return true
    @items.push item
    if item is 'lasers'
      @primaryWeapon = Crafty.e('WeaponLaser')
      @primaryWeapon.install(this)
      @listenTo @primaryWeapon, 'levelUp', (level) =>
        @scoreText 'L +1'
      return true
    if item is 'rockets'
      @secondaryWeapon = Crafty.e('WeaponRocket')
      @secondaryWeapon.install(this)
      @listenTo @secondaryWeapon, 'levelUp', (level) =>
        @scoreText 'R +1'
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
      )
      .textFont({
        size: '16px',
        weight: 'bold',
        family: 'Bank Gothic'
      })
      .tween(y: @y - 40, alpha: 0.5, 1000)
      .one('TweenEnd', -> @destroy())


