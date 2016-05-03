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
    @bind 'Hit', (data) =>
      if data.projectile.has('Bullet')
        @shiftedX += 2
        Crafty.audio.play('hit', 1, .5)
        Crafty.e('Blast, LaserHit').explode(
          x: data.projectile.x
          y: data.projectile.y
          radius: 4
          duration: 50
        )

    this

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    @vx = dx * (1000 / dt)
    @vy = dy * (1000 / dt)

