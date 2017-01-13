Crafty.c 'PlayerClone',
  init: ->
    @requires 'Enemy, playerShip, ViewportFixed'

  playerClone: (attr = {}) ->
    defaultHealth = 300
    @attr _.defaults(attr,
      h: 45,
      w: 71,
      health: defaultHealth
      maxHealth: attr.health ? defaultHealth
      weaponOrigin: [5, 30]
    )
    @origin 'center'
    @colorOverride '#808080', 'partial'

    @enemy().fixViewport()
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

  updatedHealth: ->
    sprite = 0
    healthPerc = @health / @maxHealth
    sprite = 2 if healthPerc < .3
    @sprite(0, sprite)

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    @vx = dx * (1000 / dt)
    @vy = dy * (1000 / dt)

