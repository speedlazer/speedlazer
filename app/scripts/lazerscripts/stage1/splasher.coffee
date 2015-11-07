Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Splasher extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 200
      x: 680
      y: 400
      speed: 300
    )

  execute: ->
    @sequence(
      @sendToBackground(0.75, -200)
      @movePath [
        [620, 270]
        [420, 350]
      ]
      @moveTo y: 600, speed: 100
    )

