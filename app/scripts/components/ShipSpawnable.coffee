Crafty.c 'ShipSpawnable',
  init: ->
    @requires('Listener')
    @bind('Activated', @spawnShip)
  remove: ->
    @unbind('Activated', @spawnShip)

  spawnPosition: (x, y) ->
    @spawnPosition = { x: x, y: y }
    this

  spawnShip: ->
    return unless @has('ControlScheme')
    return unless @lives > 0

    ship = Crafty.e('PlayerControlledShip')
      .attr
        x: @spawnPosition.x - Crafty.viewport.x
        y: @spawnPosition.y - Crafty.viewport.y

    ship.color(@color()) if @has('Color')
    @assignControls(ship) if @has('ControlScheme')

    @listenTo ship, 'BulletHit', -> @addPoints(10)
    @listenTo ship, 'BulletDestroyedTarget', -> @addPoints(50)
    @listenTo ship, 'Hit', ->
      ship.destroy()
      @loseLife()
      @spawnShip()
    Crafty.trigger('ShipSpawned', ship)
    this

