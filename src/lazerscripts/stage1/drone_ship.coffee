{ EntityScript } = require('src/lib/LazerScript')
{ TurretInActive, TurretActive } = require('./turret')
{ DroneFlyer } = require('./army_drone')

class DroneShip extends EntityScript

  spawn: (options) ->
    Crafty.e('DroneShip').attr(
      x: Crafty.viewport.width + 180
      y: 430
      defaultSpeed: options.speed ? 50
    )

  execute: ->
    @sequence(
      @placeSquad TurretInActive,
        options:
          attach: 'TurretPlace'
      @parallel(
        @moveTo(x: 0.4)
        @sequence(
          @wait(1000)
          @async @placeSquad TurretActive,
            options:
              attach: 'TurretPlace'
        )
      )
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

        @moveTo(x: -1.25)
        @sequence(
          @wait(3000)
          @action 'close'
        )
      )
    )

module.exports =
  default: DroneShip
