{ EntityScript } = require('src/lib/LazerScript')

class Game.Scripts.TrainAssaulter extends EntityScript
  assets: ->
    @loadAssets('playerShip')

  spawn: (options) ->
    dir = options.from ? 'top'
    switch dir
      when 'top'
        startY = .3
        @endY = .6
      when 'middle'
        startY = .5
        @endY = .5
      else
        startY = .6
        @endY = .3
    p = Crafty.e('PlayerClone').attr(
      x: Crafty.viewport.width + 40
      y: startY * Crafty.viewport.height
      defaultSpeed: options.speed ? 50
      health: 500
    ).playerClone()
    p.addComponent('BurstShot').burstShot
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Projectile, Color, Enemy, TrainBullet').attr(
          w: 16
          h: 4
          speed: 550
          damage: 1
        ).color('#FFFF00')
        projectile.shoot(x, y, angle)
    p

  execute: ->
    @bindSequence 'Destroyed', @onKilled

    @sequence(
      @movePath [
        [.7, .5]
        [1.1, @endY]
      ], rotate: no

    )

  onKilled: ->
    @bigExplosion()

