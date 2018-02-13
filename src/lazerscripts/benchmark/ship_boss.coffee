{ EntityScript } = require('src/lib/LazerScript')
{ DroneFlyer } = require('../stage1/army_drone')
{ HeliInactive } = require('../stage1/heli_attack')

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

    hatch = Crafty('ShipHatch1')
    if item and item.health > 10
      item.linkHatch(hatch)
      item.reveal()
      return item
    Crafty.e('FirstShipCabin, KeepAlive')
      .shipCabin()
      .linkHatch(hatch)
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
    hatch = Crafty('ShipHatch2')
    if item and item.health > 10
      item.linkHatch(hatch)
      item.reveal()
      return item
    Crafty.e('SecondShipCabin, KeepAlive')
      .shipCabin()
      .linkHatch(hatch)
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
      @placeSquad HeliInactive,
        amount: 2
        delay: 0
        options:
          attach: 'HeliPlace'
      @placeSquad Cabin2Inactive,
        options:
          attach: 'Cabin2Place'
      @moveTo(x: 0.4)
      @parallel(
        @moveTo(x: 0.01)
        @sequence(
          @action 'open1'
          @wait 1000
          @placeSquad DroneFlyer,
            amount: 5,
            delay: 400
            options: {
              startAt: 'ShipHatch1'
              hatchReveal: 'ShipHatch1'
              dx: 25
              dy: 20
              debug: true
              path: [
                [.5, .625]
                [.2, .5]
                [.53, .21]
                [.90, .54]

                [.5, .625]
                [.2, .5]
                [.53, .21]
                [.90, .54]

                [-20, .625]
              ]
            }
        )
      )
      @placeSquad Cabin1Active,
        options:
          attach: 'Cabin1Place'
      @moveTo(x: -.2)
      @action 'close1'
      @action 'open2'
      @wait 1000
      @parallel(
        @moveTo(x: 0.5)
        @placeSquad DroneFlyer,
          amount: 5,
          delay: 400
          options: {
            startAt: 'ShipHatch2'
            hatchReveal: 'ShipHatch2'
            dx: 25
            dy: 20
            debug: true
            path: [
              [.5, .625]
              [.2, .5]
              [.53, .21]
              [.90, .54]

              [.5, .625]
              [.2, .5]
              [.53, .21]
              [.90, .54]

              [-20, .625]
            ]
          }
      )
      @moveTo(x: -.2)
      @placeSquad Cabin2Active,
        options:
          attach: 'Cabin2Place'
      @moveTo(x: -1.5)
      @moveTo(x: -0.8)
      @moveTo(x: -1.9)
    )

module.exports =
  default: ShipBoss
