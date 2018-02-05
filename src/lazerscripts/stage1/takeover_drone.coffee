{ EntityScript } = require('src/lib/LazerScript')

class MediumDrone extends EntityScript
  assets: ->
    @loadAssets('drone')

  onKilled: ->
    @entVy = @entity.vy
    @sequence(
      @deathDecoy()
      => @entity.removeComponent('ShootOnSight')
      @addTinyScreenshake()
      @choose(
        @smallExplosion(juice: @juice, offsetX: 20, offsetY: 20)
        @smallExplosion(juice: @juice, offsetX: 20, offsetY: 20)
        @blast(@location(), damage: 1, radius: 40)
      )
      @rotate 30, 60
      @smokePrint()
      @moveTo(
        @location({
          offsetY: 800,
          offsetX: (@entVy + 300) * Math.random()
        }),
        speed: 600
        easing: 'easeInQuad'
      )
      @endDecoy()
    )
class CrewShooters extends MediumDrone

  spawn: ->
    Crafty.e('MediumDrone, ShootOnSight, Horizon').mediumDrone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .23
      defaultSpeed: 250
    ).shootOnSight
      targetType: 'Unconverted'
      shootWhenHidden: yes
      sightAngle: 200
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Projectile, Color, BackgroundBullet, Horizon').attr(
          w: 8
          h: 8
          z: -200
          speed: 400
          topDesaturation: 0.5
          bottomDesaturation: 0.5
        ).color("#DDDDFF")
        projectile.shoot(x, y, angle)

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @sendToBackground(0.50, -200)
      @movePath [
        [.96, .64]
        [.30, .35]
        [.65, .23]
        [.93, .43]
        [1.13, .63]
      ]
    )

module.exports = {
  CrewShooters
}
