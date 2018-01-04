{ EntityScript } = require('src/lib/LazerScript')
MineCannon = require('./mine_cannon').default
{ TurretInActive } = require('./turret')
{ Swirler, Shooter, CrewShooters, Stalker, ScraperFlyer } = require('../stage1/army_drone')

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
      # Fix sequencing
      #
      # Fix hatches
      #
        @sequence(
          @wait(8000)
          @placeSquad Shooter,
            amount: 3
            delay: 500
          @placeSquad Shooter,
            amount: 6
            delay: 200
        )
        @wait(8000)
        @sequence(
          @placeSquad Swirler,
            amount: 4
            delay: 1200
          @wait(6000)
          @parallel(
            @action 'open'
            @placeSquad Shooter,
              amount: 6
              delay: 1000
            @placeSquad ScraperFlyer,
              amount: 6
              delay: 800
          )

          @wait(6000)
          @placeSquad ScraperFlyer,
            amount: 4
            delay: 200
          @placeSquad Stalker,
            amount: 6
            delay: 200
        )
        @parallel(
          @moveTo(x: -0.8)

          @sequence(
            @placeSquad ScraperFlyer,
              amount: 4
              delay: 50

          )
        )
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
