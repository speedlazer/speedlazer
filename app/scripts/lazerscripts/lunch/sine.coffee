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
      [400, 200]
      [300, 250]
      [200, 200]
      [100, 150]
      [0, 200]
      [-100, 250]
    ], rotate: no

