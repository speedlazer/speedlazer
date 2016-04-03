Game = @Game
Game.Scripts ||= {}

class Game.Scripts.PresentationShooter extends Game.EntityScript
  spawn: (options) ->
    d = Crafty.e('OldDrone').drone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .71
      speed: options.speed ? 200
    )
    if options.shootOnSight
      d.addComponent('ShootOnSight').shootOnSight
        cooldown: 2000
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
      [.5, .625]
      [.2, .5]
      [.53, .21]
      [.90, .54]
      [-20, .625]
    ]

  onKilled: ->
    @oldExplosion(@location(
      offsetX: 20
      offsetY: 20
    ))
