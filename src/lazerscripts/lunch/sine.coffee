{ EntityScript } = require('src/lib/LazerScript')

class Sine extends EntityScript

  spawn: ->
    Crafty.e('OldDrone').drone(
      health: 200
      x: Crafty.viewport.width + 40
      y: 200
      defaultSpeed: 250
    )

  execute: ->
    @movePath [
      [.78,  .315]
      [.625, .468]
      [.468, .625]
      [.312, .468]
      [.156, .315]
      [0,    .468]
      [-.3,  .625]
    ], rotate: no

module.exports =
  default: Sine