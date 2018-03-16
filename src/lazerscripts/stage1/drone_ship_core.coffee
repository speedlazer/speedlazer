{ EntityScript } = require('src/lib/LazerScript')

class DroneShipCore extends EntityScript

  spawn: ->
    Crafty.e("Enemy, Color, KeepAlive")
    .attr({
      health: 5000,
      w: 160,
      h: 110,
      defaultSpeed: 20,
      pointsOnDestroy: 1000
      }).enemy().color("#0000FF")

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      # @moveTo(x: 580)
    )

  onKilled: ->
    @smallExplosion()

module.exports = {
  DroneShipCore
}
