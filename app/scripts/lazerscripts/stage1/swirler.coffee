Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Swirler extends Game.EntityScript

  spawn: (options) ->
    d = Crafty.e('Drone').drone(
      health: 200
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height / 2
      speed: options.speed ? 200
    )
    if options.shootOnSight
      d.addComponent('ShootOnSight')
    d

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @movePath [
      [.5, .21]
      [.156, .5]
      [.5, .833]
      [.86, .52]
      [-20, .21]
    ]

  onKilled: ->
    @explosion(@location())

