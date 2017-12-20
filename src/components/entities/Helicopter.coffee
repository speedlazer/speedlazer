Crafty.c 'Helicopter',
  init: ->
    @requires 'Enemy, helicopter, SpriteAnimation'
    @reel 'fly', 200, [[0, 6, 4, 2], [4, 6, 4, 2]]
    @crop 0, 9, 128, 55
    @origin 'center'
    @collision [8, 5, 120, 5, 112, 35, 12, 47]

  helicopter: (attr = {}) ->
    defaultHealth = 2750
    @attr _.defaults(attr,
      w: 128,
      h: 55,
      health: defaultHealth
      maxHealth: attr.health ? defaultHealth
      weaponOrigin: [5, 46]
    )

    @origin 'center'
    @flip('x')
    @animate 'fly', -1
    #@colorOverride '#808080', 'partial'

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

  updatedHealth: ->
    healthPerc = @health / @maxHealth
    if healthPerc < .01
      @pauseAnimation()
      @sprite(8, 6)
    else
      @animate('fly', -1) unless @isPlaying('fly')

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    @vx = dx * (1000 / dt)
    @vy = dy * (1000 / dt)
