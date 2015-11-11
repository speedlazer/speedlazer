Crafty.c 'ShipSpawnable',
  init: ->
    @requires('Listener')
    @bind('Activated', @spawnShip)

  remove: ->
    @unbind('Activated', @spawnShip)

  spawnPosition: (@spawnPosition, @armed = yes) ->
    @spawnPosition ?= ->
      x: x
      y: y
    this

  spawnShip: (armed = @armed) ->
    return unless @has('ControlScheme')
    return unless @lives > 0

    pos = @spawnPosition()
    @ship = Crafty.e('PlayerControlledShip')
      .attr
        x: pos.x - Crafty.viewport.x
        y: pos.y - Crafty.viewport.y
        z: @z

    @ship.color(@color()) if @has('Color')
    @assignControls(@ship) if @has('ControlScheme')
    @ship.installItem 'lasers' if armed

    @listenTo @ship, 'BulletHit', ->
      @stats.shotsHit += 1
      @addPoints(10)
    @listenTo @ship, 'BulletDestroyedTarget', ->
      @stats.enemiesKilled += 1
      @addPoints(50)
    @listenTo @ship, 'PowerUp', ->
      @addPoints(20)
    @listenTo @ship, 'Shoot', ->
      @stats.shotsFired += 1
    Crafty.trigger('ShipSpawned', @ship)
    # We start it after the spawned event, so that listeners can
    # reposition it before
    @ship.start()
    @listenTo @ship, 'Hit', ->
      hasLasers = @ship.hasItem 'lasers'
      Crafty.e('Explosion').explode(
        x: @ship.x + (@ship.w / 2)
        y: @ship.y + (@ship.h / 2)
        radius: @ship.w
      )
      @ship.destroy()
      @ship = null
      Crafty.e('Delay').delay(
        =>
          @loseLife()
          @spawnShip(hasLasers)
        2000
        0
      )
    this

