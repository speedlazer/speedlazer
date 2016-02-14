Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Shooter extends Game.EntityScript
  assets: ->
    @loadAssets('drone')

  spawn: (options) ->
    d = Crafty.e('Drone').drone(
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
    @parallel(
      @explosion(@location())
      => Crafty.audio.play("explosion", 1, .25)
    )

