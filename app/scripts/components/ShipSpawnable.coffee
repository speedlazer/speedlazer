Crafty.c 'ShipSpawnable',
  init: ->
    @requires('Listener')
    @bind('Activated', @spawnShip)

  remove: ->
    @unbind('Activated', @spawnShip)

  spawnPosition: (@spawnPosition, @armed = 'lasers') ->
    @spawnPosition ?= ->
      x: x
      y: y
    this

  spawnShip: (armed = @armed) ->
    return unless @has('ControlScheme')
    return unless @lives > 0
    armed = _.flatten([armed])

    pos = @spawnPosition()
    pos.x = 10 if pos.x < 10

    @ship = Crafty.e('PlayerControlledShip')
      .attr
        x: pos.x - Crafty.viewport.x
        y: pos.y - Crafty.viewport.y
        z: @z

    @ship.colorOverride(@color(), 'partial') if @has('Color')
    @assignControls(@ship) if @has('ControlScheme')

    @ship.installItem(item) for item in armed

    @listenTo @ship, 'BulletHit', (data) ->
      @stats.shotsHit += 1
      @addPoints(data?.pointsOnHit ? 0)

    @listenTo @ship, 'BulletDestroyedTarget', (data) ->
      @stats.enemiesKilled += 1
      @addPoints(data?.pointsOnDestroy ? 0)

    @listenTo @ship, 'BonusPoints', (points) ->
      @addPoints(points)

    @listenTo @ship, 'PowerUp', ->
      @addPoints(20)

    @listenTo @ship, 'Shoot', ->
      @stats.shotsFired += 1

    Crafty.trigger('ShipSpawned', @ship)
    # We start it after the spawned event, so that listeners can
    # reposition it before
    @ship.start()
    @listenTo @ship, 'Hit', ->
      Crafty.e('Blast, Explosion').explode(
        x: @ship.x + (@ship.w / 2)
        y: @ship.y + (@ship.h / 2)
        radius: @ship.w
      )
      Crafty.audio.play("explosion")
      Crafty('ScrollWall').get(0).screenShake(10, 1000)

      @ship.trigger('Destroyed', @ship)
      @ship.destroy()
      armed = @ship.items
      @ship = null
      Crafty.e('Delay').delay(
        =>
          @loseLife()
          @spawnShip(armed)
        2000
        0
      )
    this

