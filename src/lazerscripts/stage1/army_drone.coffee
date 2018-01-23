{ EntityScript } = require('src/lib/LazerScript')

class ArmyDrone extends EntityScript
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

class ShipDrone extends ArmyDrone

  spawn: (options) ->
    d = Crafty.e('Drone').drone(
      x: Crafty.viewport.width * .15
      y: Crafty.viewport.height * .9
      defaultSpeed: options.speed ? 300
      juice: options.juice
    )
    @juice = options.juice
    if options.shootOnSight
      d.addComponent('ShootOnSight').shootOnSight
        cooldown: 1000 + (Math.random() * 8000)
        sightAngle: 250
        projectile: (x, y, angle) =>
          projectile = Crafty.e('Sphere, Hostile, Projectile')
            .blink()
            .attr(
              w: 12
              h: 12
              damage: 1
              speed: 500
            )
          projectile.shoot(x, y, angle)
    d

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @movePath [
      [.15, .21]
      [.156, .5]
      [.5, .833]
      [.86, .52]

      [.5, .21]
      [.156, .5]
      [.5, .833]
      [.86, .52]

      [-20, .21]
    ], rotate: no

class Swirler extends ArmyDrone

  spawn: (options) ->
    d = Crafty.e('Drone').drone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .4
      defaultSpeed: options.speed ? 400
      juice: options.juice
    )
    @juice = options.juice
    if options.shootOnSight
      d.addComponent('ShootOnSight').shootOnSight
        cooldown: 1000 + (Math.random() * 3000)
        sightAngle: 250
        projectile: (x, y, angle) =>
          projectile = Crafty.e('Sphere, Hostile, Projectile')
            .blink()
            .attr(
              w: 12
              h: 12
              damage: 1
              speed: 550
            )
          projectile.shoot(x, y, angle)
    d

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @movePath [
      [.9, .4]
      [.85, .5]
      [.9, .6]
      [1.1, .5]

      [.5, .21]
      [.156, .5]
      [.5, .833]
      [.86, .52]

      [.5, .21]
      [.156, .5]
      [.5, .833]
      [.86, .52]

      [.5, .21]
      [.156, .5]
      [.5, .833]
      [.86, .52]

      [-20, .21]
    ], rotate: no


class Stalker extends ArmyDrone

  spawn: ->
    Crafty.e('Drone').drone(
      health: 100
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .83
      defaultSpeed: 600
      pointsOnHit: 125
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @pickTarget('PlayerControlledShip')
      @moveTo(x: 1.1, y: 1.01)
      @repeat(5, @sequence(
        @moveTo(@targetLocation(), y: 1.01, speed: 400, easing: 'easeInOutQuad')
        @wait 100
      ))
      @moveTo(y: .7, speed: 200, easing: 'easeOutQuad')

      # Wobble once before moving up
      @wait 100
      @moveTo(y: .73, speed: 100, easing: 'easeInOutQuad')
      @wait 100
      @moveTo(y: .7, speed: 100, easing: 'easeInOutQuad')

      @moveTo(y: -50, easing: 'easeInQuad')
    )

class ScraperFlyer extends ArmyDrone

  spawn: ->
    Crafty.e('Drone, ShootOnSight, Horizon').drone(
      x: -50
      y: Crafty.viewport.height * .7
      defaultSpeed: 300
    ).shootOnSight
      cooldown: 5000 + (Math.random() * 8000)
      sightAngle: 250
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Sphere, Hostile, Projectile')
          .blink()
          .attr(
            w: 12
            h: 12
            damage: 1
            speed: 500
          )
        projectile.shoot(x, y, angle)

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @sendToBackground(0.5, -400)
      @parallel(
        @movePath [
          [.6, .7]
          [.8, .3]
          [.5, .1]
          [.2, .25]
          [.5, .7]
          [.8, .4]
          [.5, .21]
          [.156, .5]
          [.5, .833]
          [.86, .52]
          [-.1, .4]
        ]
        @sequence(
          @wait 2000
          @scale(1.0, duration: 2000)
          @reveal()
        )
      )
    )

class Shooter extends ArmyDrone

  spawn: (options) ->
    d = Crafty.e('Drone').drone(
      x: if options.x then options.x else Crafty.viewport.width + 40
      y: if options.y then options.y else Crafty.viewport.height * .71
      defaultSpeed: options.speed ? 400
      juice: options.juice
    )
    @juice = options.juice
    if options.shootOnSight
      d.addComponent('ShootOnSight').shootOnSight
        cooldown: 1000 + (Math.random() * 3000)
        sightAngle: 250
        projectile: (x, y, angle) =>
          projectile = Crafty.e('Sphere, Hostile, Projectile')
            .blink()
            .attr(
              w: 12
              h: 12
              damage: 1
              speed: 500
            )
          projectile.shoot(x, y, angle)
    d

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @movePath [
      [.5, .625]
      [.2, .5]
      [.53, .21]
      [.90, .54]

      [.5, .625]
      [.2, .5]
      [.53, .21]
      [.90, .54]

      [-20, .625]
    ]

class CrewShooters extends ArmyDrone

  spawn: ->
    Crafty.e('Drone, ShootOnSight, Horizon').drone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .23
      defaultSpeed: 350
    ).shootOnSight
      targetType: 'CameraCrew'
      shootWhenHidden: yes
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Projectile, Color, BackgroundBullet, Horizon').attr(
          w: 3
          h: 3
          z: -200
          speed: 400
          topDesaturation: 0.5
          bottomDesaturation: 0.5
        ).color('#FFFF00')
        projectile.shoot(x, y, angle)

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @sendToBackground(0.50, -200)
      @parallel(
        @movePath [
          [.96, .64]
          [.30, .35]
          [.65, .23]
          [.93, .43]
          [.33, .63]
          [-.33, .23]
        ]
        @sequence(
          @wait 1500
          @scale(1.0, duration: 4000)
          @reveal()
          @shootPlayer()
        )
      )
    )

  shootPlayer: ->
    =>
      @entity.shootOnSight
        cooldown: 1000 + (Math.random() * 8000)
        sightAngle: 360
        projectile: (x, y, angle) =>
          projectile = Crafty.e('Sphere, Hostile, Projectile')
            .attr(
              w: 12
              h: 12
              damage: 1
              speed: 500
            )
            .blink()
          projectile.shoot(x, y, angle)

module.exports = {
  Swirler
  Shooter
  CrewShooters
  Stalker
  ScraperFlyer
  ShipDrone
}
