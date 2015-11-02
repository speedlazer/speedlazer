Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Swirler extends Game.EntityScript

  spawn: (options) ->
    Crafty.e('Drone').drone(
      health: 200
      x: 680
      y: 240
      speed: options.speed ? 200
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @movePath [
      [320, 100]
      [100, 240]
      [320, 400]
      [550, 250]
      [-10, 100]
    ]

  onKilled: ->
    @explosion(@location())

