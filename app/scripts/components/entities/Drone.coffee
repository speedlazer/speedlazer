Crafty.c 'Drone',
  init: ->
    @requires 'Enemy, ViewportFixed, standardDrone'

  drone: (attr = {}) ->
    @attr _.defaults(attr,
      w: 40
      h: 40
      health: 100
      defaultSpeed: 100
    )
    @origin 'center'
    @collision [2, 25, 8,18, 20,13, 30, 15, 33, 28, 14, 34, 4, 30]
    @attr weaponOrigin: [2, 25]

    @enemy().fixViewport()
    @bind 'Hit', (data) =>
      @shiftedX += 5 unless @juice is no
      Crafty.audio.play('hit', 1, .5) unless @juice is no
      Crafty.e('Blast, LaserHit').explode(
        x: data.projectile.x
        y: data.projectile.y
        radius: 4
        duration: 50
      ) if data.projectile.has('Bullet') and @juice isnt no
    this

  updatedHealth: ->
    return if @juice is no
    return @sprite(2, 4, 2, 2) if @health < 200
    @sprite(0, 4, 2, 2)

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    @vx = dx * (1000 / dt)
    @vy = dy * (1000 / dt)

    if dx > 0
      @flipX()
    else
      @unflipX()

