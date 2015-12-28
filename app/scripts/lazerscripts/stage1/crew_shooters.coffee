Game = @Game
Game.Scripts ||= {}

class Game.Scripts.CrewShooters extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone, ShootOnSight').drone(
      health: 200
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .23
      speed: 250
    ).shootOnSight
      targetType: 'CameraCrew'
      shootWhenHidden: yes
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Projectile, Color, BackgroundBullet').attr(
          w: 3
          h: 3
          speed: 300
        ).color('#FFFF00')
        projectile.shoot(x, y, angle)

  execute: ->
    @sequence(
      @sendToBackground(0.75, -200)

      @movePath [
        [.96, .66]
        [.35, .33]
        [.65, .23]
        [1.03, .53]
      ]
    )

