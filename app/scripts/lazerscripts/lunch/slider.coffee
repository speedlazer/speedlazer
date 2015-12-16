Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Slider extends Game.EntityScript

  spawn: (options) ->
    target = options.grid.getLocation()
    Crafty.e('Drone').drone(
      health: 200
      x: target.x
      y: target.y
      speed: 100
    )

  execute: ->
    @moveTo x: -30

