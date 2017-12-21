JumpMine                      = require('./stage1/jump_mine').default
SunRise                       = require('./stage1/sunrise').default
defaults                      = require('lodash/defaults')
{ LazerScript, EntityScript } = require('src/lib/LazerScript')
{ Swirler }                   = require('./stage1/army_drone')

class Test extends LazerScript
  assets: ->
    @loadAssets('playerShip')

  execute: ->
    @inventoryAdd 'weapon', 'lasers', marking: 'L'
    @inventoryAdd 'ship', 'points', marking: 'P', icon: 'star'

    @sequence(
      #@setShipType('PlayerControlledCube')
      @setWeapons(['lasers'])
      @setScenery 'Ocean'
      @async @runScript(SunRise, skipTo: 200000)
      @repeat(2, @sequence(
        @placeSquad Swirler,
          amount: 6
          delay: 250
          drop: 'points'
        @wait(1000)
      ))
      @mineSwarm()
    )

  mineSwarm: (options = { direction: 'right' })->
    @placeSquad JumpMine,
      amount: 10
      delay: 100
      options:
        gridConfig:
          x:
            start: 0.2
            steps: 8
            stepSize: 0.10
          y:
            start: 0.125
            steps: 6
            stepSize: 0.10
        points: options.points ? yes
        direction: options.direction

module.exports =
  default: Test
