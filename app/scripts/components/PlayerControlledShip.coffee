Crafty.c 'PlayerControlledShip',
  init: ->
    @requires '2D, Canvas, Color, Collision, Listener'
    @attr w: 30, h: 30
    @bind 'Moved', (from) ->
      if @hit('Edge') # Contain player within playfield
        @attr x: from.x, y: from.y
    @_forcedSpeed =
      x: 0
      y: 0
    @primaryWeapon = undefined

  start: ->
    @addComponent('Invincible').invincibleDuration(2000)
    @onHit 'Enemy', ->
      return if @has('Invincible')
      @trigger('Hit')

    @onHit 'LaserBeam', ->
      return if @has('Invincible')
      @trigger('Hit')
    @onHit 'PowerUp', (e) ->
      for pu in e
        @pickUp(pu.obj)
        @trigger('PowerUp', pu.obj)
    @bind 'EnterFrame', ->
      @x += @_forcedSpeed.x
      @y += @_forcedSpeed.y
      # Move player back if flying into an object
      @x -= @_forcedSpeed.x if @hit('Edge')
      @y -= @_forcedSpeed.y if @hit('Edge')

      # still hitting an object? then we where forced in
      # and are crashed (squashed probably)
      @trigger('Hit') if @hit('Edge')

    this

  forcedSpeed: (speed) ->
    if speed.x? && speed.y?
      @_forcedSpeed.x = speed.x
      @_forcedSpeed.y = speed.y
    else
      @_forcedSpeed.x = speed
      @_forcedSpeed.y = 0
    this

  shoot: ->
    return unless @primaryWeapon?
    @primaryWeapon.shoot()

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
        @scoreText '+1'

      return true

  hasItem: (item) ->
    @items ?= []
    return ~@items.indexOf item

  scoreText: (text) ->
    Crafty.e('Text, Canvas, 2D, Tween')
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


