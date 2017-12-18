{ EntityScript } = require('src/lib/LazerScript')

class PresentationSwirler extends EntityScript

  spawn: (options) ->
    d = Crafty.e('OldDrone').drone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height / 2
      defaultSpeed: options.speed ? 200
      health: 200
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
      [.5, .21]
      [.156, .5]
      [.5, .833]
      [.86, .52]
      [-20, .21]
    ]

  onKilled: ->
    @oldExplosion(@location(
      offsetX: 20
      offsetY: 20
    ))

module.exports =
  default: PresentationSwirler
