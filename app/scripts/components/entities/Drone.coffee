Crafty.c 'Drone',
  init: ->
    @requires 'Enemy, standardDrone'

  drone: (attr = {}) ->
    @attr _.defaults(attr,
      w: 40
      h: 40
      health: 150
      defaultSpeed: 200
    )
    @origin 'center'
    @collision [2, 25, 8,18, 20,13, 30, 15, 33, 28, 14, 34, 4, 30]
    @attr weaponOrigin: [2, 25]

    @enemy()
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
    sprite = 0
    if @health < 200
      sprite = 1

    @sprite(sprite, 0)

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    if dx > 0
      @flipX()
    else
      @unflipX()

