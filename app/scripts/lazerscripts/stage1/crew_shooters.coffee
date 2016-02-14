Game = @Game
Game.Scripts ||= {}

class Game.Scripts.CrewShooters extends Game.EntityScript
  assets: ->
    @loadAssets('drone')

  spawn: ->
    Crafty.e('Drone, ShootOnSight, ColorEffects, Horizon').drone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .23
      speed: 250
    ).shootOnSight
      targetType: 'CameraCrew'
      shootWhenHidden: yes
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Projectile, Color, BackgroundBullet, ColorEffects, Horizon').attr(
          w: 3
          h: 3
          z: -200
          speed: 300
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
          @wait 2000
          @scale(1.0, duration: 3000)
          @reveal()
          @shootPlayer()
        )
      )
    )

  onKilled: ->
    @parallel(
      @explosion(@location())
      => Crafty.audio.play("explosion", 1, .25)
    )

  shootPlayer: ->
    =>
      @entity.shootOnSight
        cooldown: 1000
        sightAngle: 8
        projectile: (x, y, angle) =>
          projectile = Crafty.e('Projectile, Color, Enemy').attr(
            w: 6
            h: 6
            speed: 350
          ).color('#FFFF00')
          projectile.shoot(x, y, angle)

