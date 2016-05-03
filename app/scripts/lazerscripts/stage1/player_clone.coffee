Game = @Game
Game.Scripts ||= {}

class Game.Scripts.PlayerClone extends Game.EntityScript
  assets: ->
    @loadAssets('playerShip')

  # TODO:
  # - Stay longer in screen
  # - Move slow
  # - Take a lot of hits
  # - Add rocket fire
  # - mix up attack patterns
  # - work great with multiple at same time

  spawn: (options) ->
    @dir = options.from ? 'top'

    p = Crafty.e('PlayerClone').attr(
      x: Crafty.viewport.width + 40
      y: .6 * Crafty.viewport.height
      defaultSpeed: options.speed ? 40
      weaponOrigin: [0, 15]
    ).playerClone()
    p.addComponent('BurstShot').burstShot
      burstCooldown: 3000
      burstAmount: 4
      cooldown: 100
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Projectile, Color, Enemy').attr(
          w: 12
          h: 4
          speed: 550
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
    @bigExplosion()

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

