Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Swirler extends Game.EntityScript
  assets: ->
    @loadAssets('drone',
      sprites:
        'drone.png':
          tile: 80
          tileh: 80
          map:
            standardDrone: [0,0]
          paddingX: 1
    )

  spawn: (options) ->
    d = Crafty.e('Drone').drone(
      health: 200
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height / 2
      speed: options.speed ? 200
    )
    if options.shootOnSight
      d.addComponent('ShootOnSight').shootOnSight
        cooldown: 1000
        sightAngle: 8
        projectile: (x, y, angle) =>
          projectile = Crafty.e('Projectile, Color, Enemy').attr(
            w: 6
            h: 6
            speed: 350
          ).color('#FFFF00')
          projectile.shoot(x, y, angle)
    d

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @movePath [
      [.5, .21]
      [.156, .5]
      [.5, .833]
      [.86, .52]
      [-20, .21]
    ]

  onKilled: ->
    @explosion(@location())

