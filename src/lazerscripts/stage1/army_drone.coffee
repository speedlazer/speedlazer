{ EntityScript } = require('src/lib/LazerScript')

class ArmyDrone extends EntityScript
  assets: ->
    @loadAssets('drone')

  onKilled: ->
    @entVy = @entity.vy
    @sequence(
      @deathDecoy()
      => @entity.removeComponent('ShootOnSight') if @entity.has('ShootOnSight')
      @addTinyScreenshake()
      @chance(.8,
        @smallExplosion(juice: @juice, offsetX: 20, offsetY: 20)
        @blast(@location(), damage: 1, radius: 30)
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

class DroneFlyer extends ArmyDrone

  spawn: (options) ->
    x = Crafty.viewport.width + 40
    x = options.x if options.x
    x = x * Crafty.viewport.width if x < 2 and x > -2
    x = Crafty(options.startAt).get(0).x if options.startAt
    x += options.dx if options.dx

    y = Crafty.viewport.height * .4
    y = options.y if options.y
    y = y * Crafty.viewport.height if y < 2 and y > -2
    y = Crafty(options.startAt).get(0).y if options.startAt
    y += options.dy if options.dy

    d = Crafty.e('Drone').drone(
      x: x
      y: y
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
              damage: 1
              speed: 500
            )
          projectile.shoot(x, y, angle)
    d

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @movePath(@options.path, rotate: no, debug: (@options.index == 0) && @options.debug)

class Swirler extends ArmyDrone

  spawn: (options) ->
    x = Crafty.viewport.width + 40
    x = options.x if options.x
    x = Crafty(options.startAt).get(0).x if options.startAt
    x += options.dx if options.dx

    y = Crafty.viewport.height * .4
    y = options.y if options.y
    y = Crafty(options.startAt).get(0).y if options.startAt
    y += options.dy if options.dy

    d = Crafty.e('Drone').drone(
      x: x
      y: y
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
              damage: 1
              speed: 500
            )
          projectile.shoot(x, y, angle)
    d

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @movePath(
      @options.path || [
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
      ],
      rotate: no
    )

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
    x = Crafty.viewport.width + 40
    x = options.x if options.x
    x = Crafty(options.startAt).get(0).x if options.startAt
    x += options.dx if options.dx

    y = Crafty.viewport.height * .71
    y = options.y if options.y
    y = Crafty(options.startAt).get(0).y if options.startAt
    y += options.dy if options.dy

    d = Crafty.e('Drone').drone(
      x: x
      y: y
      defaultSpeed: options.speed ? 400
      juice: options.juice
    )

    if options.hatchReveal
      hatch = Crafty(options.startAt).get(0)
      d.hideAt = hatch.y + hatch.h - 2

    @juice = options.juice
    if options.shootOnSight
      d.addComponent('ShootOnSight').shootOnSight
        cooldown: 1000 + (Math.random() * 3000)
        sightAngle: 250
        projectile: (x, y, angle) =>
          projectile = Crafty.e('Sphere, Hostile, Projectile')
            .blink()
            .attr(
              damage: 1
              speed: 500
            )
          projectile.shoot(x, y, angle)
    d

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @parallel(
      @sequence(
        @wait 1200
        @reveal()
      )
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
    )

module.exports = {
  Swirler
  Shooter
  Stalker
  ScraperFlyer
  DroneFlyer
}
