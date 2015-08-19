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
    ship = Crafty.e('PlayerControlledShip')
      .attr
        x: pos.x - Crafty.viewport.x
        y: pos.y - Crafty.viewport.y

    ship.color(@color()) if @has('Color')
    @assignControls(ship) if @has('ControlScheme')
    ship.installItem 'lasers' if armed
    ship.start()

    @listenTo ship, 'BulletHit', -> @addPoints(10)
    @listenTo ship, 'BulletDestroyedTarget', -> @addPoints(50)
    @listenTo ship, 'Hit', ->
      hasLasers = ship.hasItem 'lasers'
      ship.destroy()
      @loseLife()
      @spawnShip(hasLasers)
    Crafty.trigger('ShipSpawned', ship)
    this

