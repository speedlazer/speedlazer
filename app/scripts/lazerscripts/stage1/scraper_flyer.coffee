Game = @Game
Game.Scripts ||= {}

class Game.Scripts.ScraperFlyer extends Game.EntityScript
  assets: ->
    @loadAssets('drone')

  spawn: ->
    Crafty.e('Drone, ShootOnSight, ColorEffects, Horizon').drone(
      x: -50
      y: Crafty.viewport.height * .7
      speed: 300
    ).shootOnSight
      cooldown: 800
      sightAngle: 15
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Projectile, Color, Enemy').attr(
          w: 6
          h: 6
          speed: 450
        ).color('#FFFF00')
        projectile.shoot(x, y, angle)

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @sendToBackground(0.5, -400)
      @parallel(
        @movePath [
          [.6, .8]
          [.8, .3]
          [.5, .1]
          [.2, .25]
          [.5, .7]
          [.8, .4]
          [.4, .2]
          [-.1, .4]
        ]
        @sequence(
          @wait 2000
          @scale(1.0, duration: 2000)
          @reveal()
        )
      )
    )

  onKilled: ->
    @explosion(@location())
