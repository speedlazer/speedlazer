{ EntityScript } = require('src/lib/LazerScript')
{ Shooter } = require('../stage1/army_drone')


class Cabin1Inactive extends EntityScript
  spawn: (options) ->
    Crafty.e('FirstShipCabin, KeepAlive')
      .shipCabin()
      .sendToBackground(1.0, -8)

  execute: ->
    @invincible yes

class Cabin1Active extends EntityScript
  spawn: (options) ->
    item = Crafty('FirstShipCabin').get(0)
    if item and item.health > 10
      item.reveal()
      return item
    Crafty.e('FirstShipCabin, KeepAlive')
      .shipCabin()
      .sendToBackground(1.0, -8)

  onKilled: ->
    @deathDecoy()

  execute: ->
    @bindSequence 'Destroyed', @onKilled
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
    item = Crafty('SecondShipCabin').get(0)
    if item and item.health > 10
      item.reveal()
      return item
    Crafty.e('SecondShipCabin, KeepAlive')
      .shipCabin()
      .sendToBackground(1.0, -8)

  onKilled: ->
    @deathDecoy()

  execute: ->
    @bindSequence 'Destroyed', @onKilled
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
      @moveTo(x: 0.4)
      @parallel(
        @moveTo(x: 0.0)
        @sequence(
          @action 'open1'
          @wait 1000
          @placeSquad Shooter,
            amount: 5,
            delay: 200
            options: {
              startAt: 'ShipHatch1'
              hatchReveal: 'ShipHatch1'
              dx: 25
              dy: 20
            }
        )
      )
      @placeSquad Cabin1Active,
        options:
          attach: 'Cabin1Place'
      @moveTo(x: -.2)
      @action 'close1'
      @action 'open2'
      @placeSquad Cabin2Active,
        options:
          attach: 'Cabin2Place'
      @wait(15000)
      @moveTo(x: -1.5)
      @moveTo(x: -0.8)
      @moveTo(x: -1.9)
    )

module.exports =
  default: ShipBoss
