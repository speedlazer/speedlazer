Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Swirler extends Game.EntityScript
  assets: ->
    @loadAssets('drone')

  spawn: (options) ->
    d = Crafty.e('Drone').drone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height / 2
      defaultSpeed: options.speed ? 300
      juice: options.juice
    )
    @juice = options.juice
    if options.shootOnSight
      d.addComponent('ShootOnSight').shootOnSight
        cooldown: 6000 + (Math.random() * 1000)
        sightAngle: 300
        projectile: (x, y, angle) =>
          projectile = Crafty.e('Projectile, Color, Enemy').attr(
            w: 6
            h: 6
            speed: 300
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

      [.5, .21]
      [.156, .5]
      [.5, .833]
      [.86, .52]

      [-20, .21]
    ], rotate: no

  onKilled: ->
    @smallExplosion(juice: @juice)

