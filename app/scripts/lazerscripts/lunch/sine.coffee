Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Sine extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 200
      x: 680
      y: 200
      speed: 250
    )

  execute: ->
    @movePath [
      [500, 150]
      [400, 225]
      [300, 300]
      [200, 225]
      [100, 150]
      [0, 225]
      [-100, 300]
    ], rotate: no

