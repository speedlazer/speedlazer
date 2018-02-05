{ EntityScript } = require('src/lib/LazerScript')
{ DroneFlyer } = require('./army_drone')

class DroneShip extends EntityScript

  spawn: (options) ->
    Crafty.e('DroneShip').attr(
      x: Crafty.viewport.width + 180
      y: 450
      defaultSpeed: options.speed ? 150
    )

  execute: ->
    @sequence(
      @moveTo(x: 0.02)
      @action 'open'
      @wait(1000)
      @parallel(
        @placeSquad DroneFlyer,
          amount: 5,
          delay: 500
          options:
            startAt: 'ShipHatch1'
            hatchReveal: 'ShipHatch1'
            dx: 25
            dy: 20
            path: [
              [.156, .5]
              [.5, .833]
              [.86, .52]

              [.5, .21]
              [.156, .5]
              [.5, .833]
              [.86, .52]

              [-20, .21]
            ]

        @sequence(
          @wait(3000)
          @action 'close'
          @moveTo(x: -0.5)
        )
      )
    )

module.exports =
  default: DroneShip
