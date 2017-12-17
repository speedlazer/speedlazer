class Game.Scripts.Slider extends Game.EntityScript

  spawn: (options) ->
    target = options.grid.getLocation()
    Crafty.e('OldDrone').drone(
      health: 200
      x: target.x * Crafty.viewport.width
      y: target.y * Crafty.viewport.height
      defaultSpeed: 100
    )

  execute: ->
    @moveTo x: -30

