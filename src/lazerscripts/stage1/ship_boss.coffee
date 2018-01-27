{ EntityScript } = require('src/lib/LazerScript')
MineCannon = require('./mine_cannon').default
{ TurretInActive } = require('./turret')
{ Swirler, Shooter, CrewShooters, Stalker, ScraperFlyer } = require('../stage1/army_drone')

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
          delay: 500
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
            delay: 400
          @wait(6000)
          @parallel(
            # Open hatch 1
            @action 'open1'
              @placeSquad Shooter,
                amount: 5,
                delay: 200
                options: {
                  x: 525
                  y: Crafty.viewport.height + 100
                }
              @sequence(
                @wait(3000)
                # close hatch 1
                @action 'close1'
                @moveTo(x: -0.5)
              )
              @sequence(
                @wait(3000)
                # close hatch 1
                @action 'open2'
                @moveTo(x: -0.1)
              )

            # @placeSquad ScraperFlyer,
            #   amount: 6
            #   delay: 800
            # @action 'open'
            #   @placeSquad Shooter,
            #     amount: 3,
            #     delay: 200
            #     options: {
            #       x: 850
            #       y: Crafty.viewport.height + 100
            #     }
            #   @sequence(
            #     # Close hatch 1
            #     @wait(2000)
            #     @action 'close'
            #     @moveTo(x: 0.2)
            #   )
          )

          # @wait(6000)
          # @placeSquad ScraperFlyer,
          #   amount: 4
          #   delay: 200
          # @placeSquad Stalker,
          #   amount: 6
          #   delay: 200
        )
        # @parallel(
        #   @moveTo(x: -0.8)
        #
        #   @sequence(
        #     @placeSquad ScraperFlyer,
        #       amount: 4
        #       delay: 50
        #
        #   )
        # )
        # @wait(3000)
        # @sequence(
        #   @placeSquad CrewShooters,
        #     amount: 10
        #     delay: 1200
        #   @wait(6000)
        #   @placeSquad Shooter,
        #     amount: 6
        #     delay: 200
        # )
        # @placeSquad CrewShooters,
        #   amount: 10
        #   delay: 600
        # @placeSquad Shooter,
        #   amount: 7
        #   delay: 600
        # @placeSquad CrewShooters,
        #   amount: 10
        #   delay: 600

      )



      # @placeSquad Stalker,
      #   amount: 1
      #   delay: 600
    )

module.exports =
  default: ShipBoss
