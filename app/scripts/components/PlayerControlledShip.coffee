Crafty.c 'PlayerControlledShip',
  init: ->
    @requires '2D, Canvas, Color, Collision, Delay, Choreography'
    @attr w: 30, h: 30
    @bind 'Moved', (from) ->
      if @hit('Edge') # Contain player within playfield
        @attr x: from.x, y: from.y
    @_forcedSpeed =
      x: 0
      y: 0

    @delay ->
      @addComponent('Invincible').invincibleDuration(2000)
      @onHit 'Enemy', ->
        return if @has('Invincible')
        @trigger('Hit')

      @onHit 'LaserBeam', ->
        return if @has('Invincible')
        @trigger('Hit')
    , 10, 0

    @onHit 'PowerUp', (e) ->
      @pickUp(pu.obj) for pu in e

    @bind 'EnterFrame', ->
      @x += @_forcedSpeed.x
      @y += @_forcedSpeed.y
      # Move player back if flying into an object
      @x -= @_forcedSpeed.x if @hit('Edge')
      @y -= @_forcedSpeed.y if @hit('Edge')

      # still hitting an object? then we where forced in
      # and are crashed (squashed probably)
      @trigger('Hit') if @hit('Edge')

    @primaryWeapon = undefined

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
    return true if @hasItem item
    @items.push item
    if item is 'lasers'
      @primaryWeapon = Crafty.e('WeaponLaser')
      @primaryWeapon.install(this)
      return true

  hasItem: (item) ->
    @items ?= []
    return ~@items.indexOf item

