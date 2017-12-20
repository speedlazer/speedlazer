{ EntityScript } = require('src/lib/LazerScript')
MineCannon = require('./mine_cannon').default
{ Swirler, Shooter, CrewShooters, Stalker, ScraperFlyer } = require('../stage1/army_drone')

class ShipBoss extends EntityScript

  spawn: (options) ->
    Crafty.e('BattleShip').attr(
      x: Crafty.viewport.width + 180
      y: 400
      defaultSpeed: options.speed ? 150
    ).setSealevel(@level.visibleHeight - 10)

  execute: ->
    @sequence(
      @parallel(
        @placeSquad MineCannon,
          options:
            attach: 'MineCannonPlace'
        @moveTo(x: 0.8)
      )
      @moveTo(x: 0.1)
        @moveTo(x: 0.1)
      @placeSquad ScraperFlyer,
        amount: 8
        delay: 500
      @parallel(
        @placeSquad Shooter,
          amount: 3
          delay: 500
        @wait(2000)
        @moveTo(x: -0.3)

        @placeSquad Shooter,
          amount: 6
          delay: 200
        )
      # Want to place the mine cannon again.
      @placeSquad CrewShooters,
        amount: 10
        delay: 600
      @placeSquad Shooter,
        amount: 7
        delay: 600
      @moveTo(x: -0.8)
      @placeSquad CrewShooters,
        amount: 10
        delay: 600
      @moveTo(x: -1.5)
      @placeSquad Stalker,
        amount: 1
        delay: 600
    )

module.exports =
  default: ShipBoss
