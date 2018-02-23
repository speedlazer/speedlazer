{ EntityScript } = require('src/lib/LazerScript')
createEntityPool = require('src/lib/entityPool').default

dronePool = createEntityPool(
  -> Crafty.e('Drone')
  10
)

droneDecoyPool = createEntityPool(
  -> Crafty.e('Drone')
  10
)

class DroneFlyer extends EntityScript
  assets: ->
    @loadAssets('drone')

  spawnLocation: (options) ->
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
    return { x, y}

  spawnDecoy: (options) ->
    location = @spawnLocation(options)

    droneDecoyPool.get().drone(
      x: location.x
      y: location.y
      defaultSpeed: options.speed ? 400
    )

  spawn: (options) ->
    location = @spawnLocation(options)

    d = dronePool.get().drone(
      x: location.x
      y: location.y
      defaultSpeed: options.speed ? 400
    )
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

  cleanup: (entity) ->
    dronePool.recycle(entity)

  cleanupDecoy: (entity) ->
    droneDecoyPool.recycle(entity)

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @movePath(@options.path, rotate: no, debug: (@options.index == 0) && @options.debug)

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

module.exports = {
  DroneFlyer
}
