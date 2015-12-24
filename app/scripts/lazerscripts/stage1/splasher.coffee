Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Splasher extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 200
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .83
      speed: 300
    )

  execute: ->
    @sequence(
      @sendToBackground(0.75, -200)
      @movePath [
        [.96, .56]
        [.656, .73]
      ]
      @moveTo y: 1.25, speed: 100
    )

