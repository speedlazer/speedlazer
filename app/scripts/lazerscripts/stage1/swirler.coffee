Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Swirler extends Game.EntityScript
  constructor: (level) ->
    super(level)
    @choreographer = new Game.Choreographer()

  assets: ->
    @loadAssets('drone')

  spawn: (options) ->
    d = Crafty.e('Drone').drone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height / 2
      speed: options.speed ? 200
    )
    @choreography = options.choreography
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
    @movePath @choreographer.getPathForChoreography(@choreography)

  onKilled: ->
    @smallExplosion()
