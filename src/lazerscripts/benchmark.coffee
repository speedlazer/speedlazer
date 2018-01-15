{ LazerScript } = require('src/lib/LazerScript')
{ StartOfDawn, DayBreak, Morning } = require('./stage1/sunrise')
{ Swirler, Shooter } = require('./stage1/army_drone')

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
      @setScenery 'Bay'
      @setSpeed 0
      @wait 1500
      => Crafty('DebugInfo').capture('start')
      @setSpeed 300
      @wait 15000
      => Crafty('DebugInfo').capture('scrolling')
      @runScript(StartOfDawn, speed: 5)
      @runScript(DayBreak, speed: 5)
      @runScript(Morning, speed: 5)
      => Crafty('DebugInfo').capture('recolor')
      => Crafty('PlayerSpaceship').addComponent('Invincible').invincibleDuration(15000)
      @enemies()
      => Crafty('DebugInfo').capture('swirlers')
      => Crafty('PlayerSpaceship').shoot(true)
      @enemies()
      => Crafty('PlayerSpaceship').shoot(false)
      => Crafty('DebugInfo').capture('swirlers shooting')
      @wait 1000
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

