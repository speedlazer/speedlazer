Game = @Game
Game.Scripts ||= {}

class Game.Scripts.HeliAttack extends Game.EntityScript
  assets: ->
    @loadAssets('helicopter')

  spawn: (options) ->
    @dir = options.from ? 'top'
    @ground = options.ground ? 1.1

    p = Crafty.e('Helicopter').attr(
      x: Crafty.viewport.width + 40
      y: .6 * Crafty.viewport.height
      defaultSpeed: options.speed ? 40
      weaponOrigin: [0, 25]
    ).helicopter()
    p.addComponent('BurstShot').burstShot
      burstCooldown: 2500
      burstAmount: 7
      angle: -15
      angleDeviation: 10
      aim: 45
      cooldown: 50
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Projectile, Color, Enemy').attr(
          w: 12
          h: 4
          speed: 350
        ).color('#FFFF00')
        projectile.shoot(x, y, angle)
    p

  execute: ->
    @bindSequence 'Destroyed', @onKilled

    @while(
      @flightPath()
      @sequence(
        @fireRockets()
        @wait 5000
      )
    )

  flightPath: ->
    if @dir is 'top'
      @movePath [
        [.9, .4]
        [.7, .25]
        [.65, .2]
        [.4, .6]
        [.6, .7]
        [.8, .5]
        [.4, .8]
        [.2, .3]
        [-.2, .5]
      ]
    else
      @movePath [
        [.9, .6]
        [.7, .75]
        [.65, .8]
        [.4, .4]
        [.6, .3]
        [.8, .5]
        [.4, .2]
        [.2, .7]
        [-.2, .5]
      ]

  onKilled: ->
    @sequence(
      @deathDecoy()
      @bigExplosion()
      @while(
        @movePath [
          [.6, @ground]
        ], speed: 250
        @sequence(
          @blast(@location(),
            radius: 10,
            duration: 480,
            z: -1
            lightness: .2
            alpha: .5
          )
          @blast(@location(offsetX: 10, offsetY: 5),
            radius: 5,
            duration: 180,
            z: -1
          )
          @wait 100
        )
      )
      @movePath [
        [.6, @ground - .02]
        [.6, @ground]
      ], speed: 50
      @bigExplosion()
      =>
        @entity.removeComponent('ViewportFixed')
        @entity.attr(lightness: .3)
      @wait 10000
      @endDecoy()
    )

  fireRockets: (amount) ->
    script = Game.Scripts.Stage1BossRocket

    @sequence(
      @async @placeSquad(script,
        options:
          z: 5
          offsetX: 0
          offsetY: 50
          scale: .75
          health: 100
          location: @location()
      )
      @async @placeSquad(script,
        options:
          z: -5
          offsetX: 0
          offsetY: -50
          scale: .75
          health: 100
          location: @location()
      )
      @wait 500
    )

