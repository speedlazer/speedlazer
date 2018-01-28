{ EntityScript } = require('src/lib/LazerScript')


class Cabin1Inactive extends EntityScript
  spawn: (options) ->
    Crafty.e('FirstShipCabin, KeepAlive')
      .shipCabin()
      .sendToBackground(1.0, -8)

  execute: ->
    @invincible yes

class Cabin1Active extends EntityScript
  spawn: (options) ->
    Crafty('FirstShipCabin')
      .reveal()

  execute: ->
    @sequence(
      @invincible no
      @wait(20000)
    )

class Cabin2Inactive extends EntityScript
  spawn: (options) ->
    Crafty.e('SecondShipCabin, KeepAlive')
      .shipCabin()
      .sendToBackground(1.0, -8)

  execute: ->
    @invincible yes

class Cabin2Active extends EntityScript
  spawn: (options) ->
    Crafty('SecondShipCabin')
      .reveal()

  execute: ->
    @sequence(
      @invincible no
      @wait(20000)
    )

class ShipBoss extends EntityScript

  spawn: (options) ->
    Crafty.e('BattleShip').attr(
      x: Crafty.viewport.width + 180
      y: 400
      defaultSpeed: options.speed ? 45
    )

  execute: ->
    @sequence(
      @placeSquad Cabin1Inactive,
        options:
          attach: 'Cabin1Place'
      @placeSquad Cabin2Inactive,
        options:
          attach: 'Cabin2Place'
      @moveTo(x: 0.2)
      @placeSquad Cabin1Active,
      @wait(15000)
      @moveTo(x: -.5)
      @placeSquad Cabin2Active,
      @wait(15000)
      @moveTo(x: -1.5)
      @moveTo(x: -0.8)
      @moveTo(x: -1.9)
    )

module.exports =
  default: ShipBoss
