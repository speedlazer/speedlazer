{ EntityScript } = require('src/lib/LazerScript')
{ ShipDrone } = require('./army_drone')

class DroneShip extends EntityScript

  spawn: (options) ->
    Crafty.e('DroneShip').attr(
      x: Crafty.viewport.width + 180
      y: 450
      defaultSpeed: options.speed ? 350
    ).setSealevel(@level.visibleHeight + 10)

  execute: ->
    @sequence(
      @moveTo(x: 0.02)
      @action 'open'
      @wait(1000)
      @parallel(
        @placeSquad ShipDrone,
          amount: 5,
          drop: 'pool'
          delay: 500
          options:
            shootOnSight: yes
        @sequence(
          @wait(3000)
          @action 'close'
          @moveTo(x: -0.5)
        )
      )
    )

module.exports =
  default: DroneShip
