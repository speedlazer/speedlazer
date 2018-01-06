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
      @setShipType('PlayerControlledCube')

      @setWeapons(['lasers'])
      @setScenery 'Ocean'
      @setSpeed 0

      @async @runScript(StartOfDawn, speed: 1)
    )

module.exports =
  default: Test
