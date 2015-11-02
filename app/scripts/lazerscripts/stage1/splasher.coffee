Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Splasher extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 200
      x: 680
      y: 400
      speed: 100
    )

  execute: ->
    @sequence(
      @sendToBackground(0.75, -200)
      @movePath [
        [620, 270]
        [520, 320]
        [420, 230]
        [320, 330]
        [319, 360]
      ]
      @moveTo y: 600
    )

