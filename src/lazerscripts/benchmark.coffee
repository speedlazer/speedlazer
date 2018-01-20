{ LazerScript } = require('src/lib/LazerScript')
{ StartOfDawn, DayBreak, Morning } = require('./stage1/sunrise')
{ Swirler, Shooter, Stalker } = require('./stage1/army_drone')
ShipBoss = require('./benchmark/ship_boss').default

class Benchmark extends LazerScript
  assets: ->
    @loadAssets('explosion', 'playerShip', 'general')

  execute: ->
    @inventoryAdd 'weapon', 'lasers', marking: 'L'
    @inventoryAdd 'ship', 'points', marking: 'P', icon: 'star'
    Crafty.e('DebugInfo')

    @sequence(
      #@setShipType('PlayerControlledCube')

      @setWeapons(['lasers'])
      @setScenery 'Ocean'
      @setSpeed 0
      @runScript(StartOfDawn, speed: 4)
      #@placeSquad Stalker,
        #drop: 'pool'
      @wait 1500
      => Crafty('DebugInfo').capture('start')
      @setSpeed 300
      @wait 15000
      @setScenery('CoastStart')
      => Crafty('DebugInfo').capture('scrolling')
      @runScript(DayBreak, speed: 8)
      @runScript(Morning, speed: 8)
      => Crafty('DebugInfo').capture('recolor')
      @placeSquad ShipBoss
      => Crafty('DebugInfo').capture('ship particles')
      @setScenery('BayStart')
      => Crafty('PlayerSpaceship').each(-> @addComponent('Invincible').invincibleDuration(15000))
      @enemies()
      => Crafty('DebugInfo').capture('swirlers')
      => Crafty('PlayerSpaceship').each(-> @shoot(true))
      @enemies()
      => Crafty('PlayerSpaceship').each(-> @shoot(false))
      => Crafty('DebugInfo').capture('swirlers shooting')
      @parallel(
        @gainHeight(800, duration: 14000)
        @setScenery('Skyline')
      )
      => Crafty('PlayerSpaceship').each(-> @shoot(true))
      @enemies()
      => Crafty('PlayerSpaceship').each(-> @shoot(false))
      => Crafty('DebugInfo').capture('swirlers shooting skyline')
      @setScenery 'Ocean'
      @gainHeight(-800, duration: 14000)
      => Crafty('DebugInfo').capture('end')
    )

  enemies: ->
    @parallel(
      @placeSquad Shooter,
        amount: 4
        delay: 250
        options:
          shootOnSight: yes
      @placeSquad Swirler,
        amount: 4
        delay: 250
        options:
          shootOnSight: yes
      @say 'General', 'Time to get some good benchmark scores!\n' +
        'Shooting aliens is important', noise: 'low'
    )

module.exports =
  default: Benchmark
