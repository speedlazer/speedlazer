Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Shooter extends Game.EntityScript

  spawn: (options) ->
    d = Crafty.e('Drone').drone(
      health: 200
      x: 680
      y: 340
      speed: options.speed ? 200
    )
    if options.shootOnSight
      d.addComponent('ShootOnSight')
    d

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @movePath [
      [320, 300]
      [130, 240]
      [340, 100]
      [570, 260]
      [-10, 400]
    ]

  onKilled: ->
    @explosion(@location())

