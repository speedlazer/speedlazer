JumpMine                      = require('./stage1/jump_mine').default
{ StartOfDawn, DayBreak, Morning, Noon } = require('./stage1/sunrise')
defaults                      = require('lodash/defaults')
{ LazerScript, EntityScript } = require('src/lib/LazerScript')
{ Swirler, Stalker }          = require('./stage1/army_drone')

class Test extends LazerScript
  assets: ->
    @loadAssets('playerShip')

  execute: ->
    @inventoryAdd 'weapon', 'lasers', marking: 'L'
    @inventoryAdd 'ship', 'points', marking: 'P', icon: 'star'
    Crafty.e('DebugInfo')

    @sequence(
      #@setShipType('PlayerControlledCube')
      #
      @setWeapons(['lasers'])
      @setScenery 'Ocean'
      @setSpeed 200

      @async @runScript(StartOfDawn, speed: 1)

      @repeat(3, @placeSquad(Swirler,
        amount: 6
        delay: 250
        drop: 'points'
      ))
      @async @runScript(DayBreak, speed: 1)
      @mineSwarm()

      @repeat(2, @placeSquad(Swirler,
        amount: 6
        delay: 250
        drop: 'points'
      ))
      @async @runScript(Morning, speed: 1)
      @mineSwarm()

      @repeat(2, @placeSquad(Swirler,
        amount: 6
        delay: 250
        drop: 'points'
      ))
      @async @runScript(Noon, speed: 1)

      #@placeSquad Stalker,
        #drop: 'pool'
      #@wait(1000)
      #@setSpeed 400
      #@gainHeight(150, duration: 4000)
      #@setScenery 'CoastStart'

      #@setSpeed 200
      #@mineSwarm()

      #@placeSquad Swirler,
        #amount: 6
        #delay: 250
        #drop: 'points'
      #@setScenery 'BayStart'

      #@wait 2000
      #@placeSquad Swirler,
        #amount: 6
        #delay: 250
        #drop: 'points'

      #@placeSquad Swirler,
        #amount: 6
        #delay: 250
        #drop: 'points'

      #@gainHeight(150, duration: 4000)

      #@wait 10000
      #@gainHeight(-300, duration: 4000)
    )

  mineSwarm: (options = { direction: 'right' })->
    @placeSquad JumpMine,
      amount: 2
      delay: 1000
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
