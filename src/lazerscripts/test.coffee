{ LazerScript } = require('src/lib/LazerScript')
{ StartOfDawn } = require('./stage1/sunrise')

class Test extends LazerScript
  assets: ->
    @loadAssets('playerShip')

  execute: ->
    @inventoryAdd 'weapon', 'lasers', marking: 'L'
    @inventoryAdd 'ship', 'points', marking: 'P', icon: 'star'
    Crafty.e('DebugInfo')

    @sequence(
      #@setShipType('PlayerControlledCube')

      @setWeapons(['lasers'])
      @setScenery 'Ocean'
      @setSpeed 0
      @panCamera(y: 120, 0)
      @wait 1500
      @panCamera(y: -120, 4000)
      @wait 1500
      @setSpeed 300
      @wait 15000
      @gainHeight 20, duration: 1000
      @wait 5000
      @gainHeight 60, duration: 4000

      @wait 10000
      @gainHeight -140, duration: 4000

      @async @runScript(StartOfDawn, speed: 1)
    )

module.exports =
  default: Test
