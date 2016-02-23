Game = @Game
Game.Scripts ||= {}

class Game.Scripts.TrainAssaulter extends Game.EntityScript
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
    p = Crafty.e('Enemy, Color').attr(
      x: Crafty.viewport.width + 40
      y: startY * Crafty.viewport.height
      speed: options.speed ? 100
      health: 900
      w: 30
      h: 30
      weaponOrigin: [0, 15]
    ).enemy().color('#FF0000')
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

