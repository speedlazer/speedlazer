{ EntityScript } = require('src/lib/LazerScript')

class DroneShipCoreInactive extends EntityScript

  spawn: ->
    Crafty.e("Enemy, Color, KeepAlive, BattleShipCore")
    .attr({
      health: 10000,
      w: 160,
      h: 110,
      defaultSpeed: 20,
      pointsOnDestroy: 1000
    })
    .enemy()
    .color("#0000FF")
    .sendToBackground(1.0, -5)

  execute: ->
    @sequence(
      @invincible yes
      @smallExplosion()
      @wait(30)
      @smallExplosion()
    )

class DroneShipCore extends EntityScript

  spawn: ->
    item = Crafty('BattleShipCore').get(0)
    if item and item.health > 10
      item.reveal()
      return item
    Crafty.e("Enemy, Color, KeepAlive, BattleShipCore")
      .attr({
        health: 10000,
        w: 160,
        h: 110,
        defaultSpeed: 20,
        pointsOnDestroy: 1000
      })
      .enemy()
      .color("#0000FF")
      .sendToBackground(1.0, -5)

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @invincible no
      @repeat(
        @wait(500)
      )
    )

  onKilled: ->
    @sequence(
      @smallExplosion()
      @wait(30)
      @smallExplosion()
    )

module.exports = {
  DroneShipCore,
  DroneShipCoreInactive
}