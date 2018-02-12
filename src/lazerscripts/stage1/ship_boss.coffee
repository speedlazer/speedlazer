{ EntityScript } = require('src/lib/LazerScript')
MineCannon = require('./mine_cannon').default
{ TurretInActive } = require('./turret')
{ Swirler, Shooter, Stalker, ScraperFlyer } = require('../stage1/army_drone')

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
    # .setSealevel(@level.visibleHeight - 10)

  execute: ->
    @sequence(
      @parallel(
        @placeSquad MineCannon,
          options:
            attach: 'MineCannonPlace'
        @placeSquad Cabin1Inactive,
          options:
            attach: 'Cabin1Place'
        @placeSquad Cabin2Inactive,
          options:
            attach: 'Cabin2Place'
        @placeSquad TurretInActive, # Turret
          amount: 2
          delay: 0
          options:
            attach: 'TurretPlace'

        @moveTo(x: 0.8)
      )
      @wait(500)
      @parallel(
        @moveTo(x: -1.5)
        @placeSquad ScraperFlyer,
          amount: 4
          delay: 200
          options: {
            x: 20
            y: -20
          }
      # Fix sequencing
      #
      # Fix hatches
      #
        @sequence(
          @wait(8000)
          @placeSquad Shooter,
            amount: 3
            delay: 250
            options: {
              x: 20
              y: 300
            }
          #
          # @placeSquad Shooter,
          #   amount: 6
          #   delay: 200
        )
        @wait(8000)
        @sequence(
          @placeSquad Swirler,
            amount: 4
            delay: 200
          @wait(6000)
          @parallel(
            # Open hatch 1
            @action 'open1'
            @placeSquad Shooter,
              amount: 5,
              delay: 200
              options: {
                startAt: 'ShipHatch1'
                hatchReveal: 'ShipHatch1'
                dx: 25
                dy: 20
              }
            @sequence(
              @wait(3000)
              # close hatch 1
              @action 'close1'
              @moveTo(x: -2)
            )
            @wait(3000)

          )
          @sequence(
            # open hatch 2
            @action 'open2'

            @parallel(
              @placeSquad Shooter,
                amount: 3,
                delay: 200
                options: {
                  startAt: 'ShipHatch2'
                  hatchReveal: 'ShipHatch2'
                  dx: 25
                  dy: 20
                }

              @placeSquad Shooter,
                amount: 3,
                delay: 200
                options: {
                  startAt: 'ShipHatch2'
                  hatchReveal: 'ShipHatch2'
                  dx: 25
                  dy: 20
                }
              @placeSquad ScraperFlyer,
                amount: 8,
                delay: 700
                options: {
                  x: 915
                  y: 0
                }
            )
            @action 'close2'
            @parallel(
                @moveTo(x: -.5) # Move the boat out of view

                # Show some aircrafts here
                @placeSquad Shooter,
                  amount: 8,
                  delay: 600
                  options: {
                    x: -15
                    y: 100
                  }

                @placeSquad Swirler,
                  amount: 6,
                  delay: 200
                  options: {
                    x: -15
                    y: 100
                  }
            )
            @moveTo(x: -2) # move back!

            @action 'open2'
            @placeSquad Shooter, # 2
              amount: 6,
              delay: 200
              options: {
                startAt: 'ShipHatch2'
                hatchReveal: 'ShipHatch2'
                dx: 25
                dy: 20
              }
            @wait(2000)
            @action 'open1'
            @placeSquad Shooter, # 1
              amount: 3,
              delay: 200
              options: {
                startAt: 'ShipHatch1'
                hatchReveal: 'ShipHatch1'
                dx: 25
                dy: 20
              }
            @wait(1000)
            @placeSquad Shooter, # 1
              amount: 6,
              delay: 200
              options: {
                startAt: 'ShipHatch1'
                hatchReveal: 'ShipHatch1'
                dx: 25
                dy: 20
              }
              @wait(1000)
              @action 'close1'
              @placeSquad Shooter, # 2
                amount: 7,
                delay: 200
                options: {
                  x: 565
                  y: Crafty.viewport.height + 100
                }
              @wait(1000)
              @action 'close2'

            @wait(5000)
            @moveTo(x: -5) # move forward!


          )

        )
      )
    )

module.exports =
  default: ShipBoss
