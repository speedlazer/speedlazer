Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Shooter extends Game.EntityScript

  spawn: (options) ->
    d = Crafty.e('Drone').drone(
      health: 200
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .71
      speed: options.speed ? 200
    )
    if options.shootOnSight
      d.addComponent('ShootOnSight')
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
    @explosion(@location())

