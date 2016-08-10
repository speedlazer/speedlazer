Crafty.c 'ShipSpawnable',
  init: ->
    @requires('Listener')
    @bind 'Activated', @spawnShip

  remove: ->
    @unbind('Activated', @spawnShip)

  spawnPosition: (@spawnPosition) ->
    @spawnPosition ?= ->
      x: x
      y: y
    this

  spawnShip: (stats = {}) ->
    return unless @has('ControlScheme')
    return unless @lives > 0

    pos = @spawnPosition()
    pos.x = 10 if pos.x < 10
    if @ship?
      pos = {
        x: @ship.x + Crafty.viewport.x
        y: @ship.y + Crafty.viewport.y
      }
      @ship.destroy()
      @ship = null

    @ship = Crafty.e(@level.getShipType())
      .attr
        x: pos.x - Crafty.viewport.x
        y: pos.y - Crafty.viewport.y
        z: @z
        playerNumber: @playerNumber

    @ship.playerColor = @color()
    @ship.colorOverride?(@color(), 'partial') #if @has('ColorEffects')
    @ship.color?(@color()) if @has('Color')
    @ship.setSealevel((Crafty.viewport.height - 20) + (@level.sealevelOffset ? 0))

    @assignControls(@ship) if @has('ControlScheme')

    @listenTo @ship, 'HitTarget', (data) ->
      @stats.shotsHit += 1
      @addPoints(data?.pointsOnHit ? 0)

    @listenTo @ship, 'DestroyTarget', (data) ->
      @stats.enemiesKilled += 1
      @addPoints(data?.pointsOnDestroy ? 0)

    @listenTo @ship, 'BonusPoints', (points) ->
      @addPoints(points)

    @listenTo @ship, 'PowerUp', (powerUp) ->
      if powerUp.type is 'ship'
        @gainLife() if powerUp.contains is 'life'
        @addPoints(500) if powerUp.contains is 'points'
      @addPoints(20)

    @listenTo @ship, 'Shoot', ->
      @stats.shotsFired += 1

    @trigger('ShipSpawned', @ship)
    Crafty.trigger('ShipSpawned', @ship)

    @ship.stats stats
    # We start it after the spawned event, so that listeners can
    # reposition it before
    @ship.start()
    @listenTo @ship, 'Destroyed', ->
      @ship.destroy()
      stats = @ship.stats()
      @ship = null
      Crafty.e('Delay').delay(
        =>
          @loseLife()
          @spawnShip(stats)
        2000
        0
      )
    this

