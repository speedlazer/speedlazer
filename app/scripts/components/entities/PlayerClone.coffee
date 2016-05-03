Crafty.c 'PlayerClone',
  init: ->
    @requires 'Enemy, playerShip'

  playerClone: (attr = {}) ->
    @attr _.defaults(attr,
      h: 45,
      w: 71,
      health: 4000,
      weaponOrigin: [5, 30]
    )
    @origin 'center'
    @flipX()
    @colorOverride '#808080', 'partial'

    @enemy()
    this

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    @vx = dx * (1000 / dt)
    @vy = dy * (1000 / dt)

