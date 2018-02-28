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
        x: @ship.x
        y: @ship.y
      }
      @ship.destroy()
      @ship = null

    @ship = Crafty.e(@level.getShipType())
      .attr
        x: pos.x
        y: pos.y
        z: @z
        playerNumber: @playerNumber

    @ship.playerColor = @color()
    @ship.colorOverride?(@color(), 'partial') #if @has('ColorEffects')
    @ship.color?(@color()) if @has('Color')
    @ship.attr(healthPerc: @health / @maxHealth)

    @assignControls(@ship) if @has('ControlScheme')

    @listenTo @ship, 'HitTarget', (data) ->
      @stats.shotsHit += 1
      points = (data.pointsOnHit ? 0)
      @addPoints(points, data.location) if data?

    @listenTo @ship, 'DestroyTarget', (data) ->
      @stats.enemiesKilled += 1
      points = (data.pointsOnDestroy ? 0) +
        (data.pointsOnHit ? 0)
      @addPoints(points, data.location) if data?
      @addChainXP(points) if data.chainable

    @listenTo @ship, 'BonusPoints', (data) ->
      @addPoints(data.points, data.location)

    @listenTo @ship, 'PowerUp', (powerUp) ->
      if powerUp.type in ['ship', 'shipBoost', 'shipUpgrade']
        @gainLife() if powerUp.contains is 'life'
        @healthUpgrade() if powerUp.contains is 'healthu'
        @healthBoost() if powerUp.contains is 'healthb'
        @addPoints(500) if powerUp.contains is 'points'
      @addPoints(20)
      @ship.attr(healthPerc: @health / @maxHealth)

    @listenTo @ship, 'Shoot', ->
      @stats.shotsFired += 1

    @trigger('ShipSpawned', @ship)
    Crafty.trigger('ShipSpawned', @ship)

    @ship.stats stats
    # We start it after the spawned event, so that listeners can
    # reposition it before
    @ship.start()
    @listenTo @ship, 'Hit', (d) ->
      @loseHealth(d.damage)
      @ship.attr(healthPerc: @health / @maxHealth)

      if (@health < 0)
        @ship.trigger('Die')

    @listenTo @ship, 'Destroyed', ->
      @ship.destroy()
      stats = @ship.stats()
      @ship = null
      Game.setGameSpeed 0.3
      Crafty.e('Delay, TimeManager').delay(
        -> Game.setGameSpeed 0.2
        500
        0
      ).delay(
        -> Game.setGameSpeed 0.4
        1000
        0
      ).delay(
        -> Game.setGameSpeed 0.7
        1400
        0
      ).delay(
        =>
          @loseLife()
          Game.setGameSpeed 1.0
          @spawnShip(stats)
        1800
        0
        -> @destroy()
      )
    this

