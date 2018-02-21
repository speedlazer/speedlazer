extend = require('lodash/extend')
{ LazerScript } = require('src/lib/LazerScript')
{ DroneFlyer } = require('./stage1/army_drone')
{ HeliAttack } = require('./stage1/heli_attack')
{ Stage1BossRocketStrike, Stage1BossStage1, BossHeliAttack } = require('./stage1/stage1boss')
{ StartOfDawn, DayBreak, Morning } = require('./stage1/sunrise')

CameraCrew  = require('./stage1/camera_crew').default
DroneShip   = require('./stage1/drone_ship').default
IntroBarrel = require('./stage1/barrel').default
JumpMine    = require('./stage1/jump_mine').default
ShipBoss    = require('./stage1/ship_boss').default
StageEnd    = require('./stage1end').default

class Stage1 extends LazerScript
  nextScript: StageEnd

  assets: ->
    @loadAssets('explosion', 'playerShip', 'general')

  execute: ->
    Crafty.e('DebugInfo')
    @inventoryAdd 'weapon', 'lasers', marking: 'L'

    @inventoryAdd 'ship', 'life', marking: '❤', icon: 'heart'
    @inventoryAdd 'shipUpgrade', 'healthu', marking: '❤', icon: 'heart'
    @inventoryAdd 'shipBoost', 'healthb', marking: '❤', icon: 'heart'
    @inventoryAdd 'ship', 'points', marking: 'P', icon: 'star'

    #@inventoryAdd 'weaponUpgrade', 'rapid', marking: 'RF', icon: 'rapidFireBoost'
    #@inventoryAdd 'weaponUpgrade', 'damage', marking: 'D', icon: 'damageBoost'
    #@inventoryAdd 'weaponUpgrade', 'aim', marking: 'A', icon: 'aimBoost'
    #@inventoryAdd 'weaponUpgrade', 'speed', marking: 'S', icon: 'speedBoost'

    #@inventoryAdd 'weaponBoost', 'rapidb', marking: 'RF', icon: 'rapidFireBoost'
    #@inventoryAdd 'weaponBoost', 'aimb', marking: 'A', icon: 'aimBoost'
    #@inventoryAdd 'weaponBoost', 'speedb', marking: 'S', icon: 'speedBoost'
    #@inventoryAdd 'weaponBoost', 'damageb', marking: 'D', icon: 'damageBoost'

    @sequence(
      #@setPowerupPool 'rapidb', 'speed', 'points', 'rapidb'
      @lazy @introText
      @lazy @sunRise, 0
      @lazy @tutorial

      #@setPowerupPool 'aimb', 'speedb', 'rapidb', 'speed', 'aim', 'rapid'

      @lazy @droneTakeover
      @lazy @sunRise, 1
      @lazy @oceanFighting
      @lazy @midStageBossFight

      #@setPowerupPool 'aim', 'speedb', 'rapidb', 'rapid', 'rapidb', 'aimb'
      #@midStageBossFight()
      #@cityBay()
      #@setPowerupPool 'speed', 'rapid', 'aim', 'speed', 'rapid', 'aim'
      #@endStageBossfight()
    )

  introText: ->
    @sequence(
      @setWeapons(['lasers'])
      @setSpeed 200, accellerate: no
      @setScenery('Intro')
      @async @placeSquad(CameraCrew)
      @async @placeSquad(
        IntroBarrel,
        amount: 2,
        delay: 0,
        options:
          attach: 'BoxesLocation'
      )
      @say 'General', 'Let us escort you to the factory to install\n' +
        'the AI controlled defence systems. You are the last ship.', noise: 'low'
      #@say 'General', 'It saves lives when you no longer need soldiers,\n' +
      #'AI technology is the future after all.'
      #@wait 1500
    )

  tutorial: ->
    @sequence(
      @setScenery('Ocean')
      @say('General', 'We send some drones for some last manual target practice', noise: 'low')
      @setSpeed 200
      @parallel(
        @showText 'Get Ready', color: '#00FF00', mode: 'blink', blink_amount: 6, blink_speed: 100
        @say('John', 'Let\'s go!')
      )
      @placeSquad DroneFlyer,
        amount: 6
        delay: 250
        options:
          path: [
            [.9, .6]
            [.25, .4]
            [.16, -0.1]
          ]

      @parallel(
        @gainHeight(150, duration: 4000)
        @placeSquad DroneFlyer,
          amount: 6
          delay: 250
          options:
            path: [
              [.9, .3]
              [.65, .3]
              [.35, .7]
              [-.1, .7]
            ]
      )
      @parallel(
        @say('General', 'Great job!', noise: 'low')
        @placeSquad DroneFlyer,
          amount: 6
          delay: 250
          options:
            path: [
              [.5, .625]
              [.2, .5]
              [.53, .21]
              [.8, -.02]
            ]
      )
    )

  droneTakeover: ->
    @sequence(
      @say('John', 'What is that for drone!??')
      @parallel(
        @say('General', 'We need to get out of this chopper!', noise: 'low')
        #@say('General', 'They do not respond to our commands anymore!\nOur defence AI has been hacked!', noise: 'low')
        @placeSquad BossHeliAttack
      )
      @async @chapterTitle(1, 'Hacked')
    )

  oceanFighting: ->
    @sequence(
      @parallel(
        @sequence(
          @wait 2000
          @say 'John', 'We\'re under attack!?!', noise: 'none'
        )

        @attackWaves(
          @parallel(
            @repeat 2, @sequence(
              @parallel(
                @placeSquad DroneFlyer,
                  amount: 4
                  delay: 400
                  options:
                    x: .5
                    y: -.01
                    path: [
                      [.5, .2]
                      [.7, .2]
                      [.93, .31]
                      [.8, .5]
                      [.5, .5]
                      [-.1, .3]
                    ]
                 @placeSquad DroneFlyer,
                  amount: 4
                  delay: 400
                  options:
                    x: .5
                    y: 1.11
                    path: [
                      [.5, .8]
                      [.7, .8]
                      [.93, .69]
                      [.8, .5]
                      [.5, .5]
                      [-.1, .7]
                    ]
              )
              @wait 1000
            )
          )
        )
      )
      @parallel(
        @placeSquad HeliAttack,
          options:
            speed: 80
            path: [
              [.9, .4]
              [.7, .25]
              [.55, .2]
              [.4, .5]
              [.6, .7]
              [.8, .5]
              [.4, .8]
              [.2, .3]
              [-.2, .5]
            ]
        @gainHeight(-150, duration: 4000)
      )
      @wait 5000
      @parallel(
        @burstFlight(.2, 0)
        @burstFlight(.4, 1000)
        @burstFlight(.6, 2000)
      )
      @placeSquad DroneFlyer,
        amount: 4
        delay: 400
        options:
          x: -.2
          y: 0.5
          path: [
            [.5, .8]
            [.7, .8]
            [.93, .69]
            [.8, .5]
            [.5, .5]
            [-.1, .7]
          ]
      @placeSquad DroneFlyer,
        amount: 4
        delay: 400
        options:
          x: -.2
          y: 0.2
          path: [
            [.5, .5]
            [.7, .5]
            [.93, .39]
            [.8, .2]
            [.5, .2]
            [-.1, .4]
          ]
      @parallel(
        @placeSquad DroneShip
        @sequence(
          @wait 5000
          @parallel(
            @placeSquad DroneFlyer,
              amount: 4
              delay: 400
              options:
                x: -.2
                y: 0.2
                path: [
                  [.5, .5]
                  [.7, .5]
                  [.93, .39]
                  [.8, .2]
                  [.5, .2]
                  [-.1, .4]
                ]
            @burstFlight(.6, 3000)
          )
        )
      )
      @parallel(
        @placeSquad DroneFlyer,
          amount: 6
          delay: 400
          options:
            x: 0.9
            y: -0.1
            path: [
              [.5, .5]
              [-.1, .3]
            ]
        @placeSquad DroneFlyer,
          amount: 6
          delay: 400
          options:
            x: 0.8
            y: -0.1
            path: [
              [.4, .5]
              [-.2, .3]
            ]
      )
      @parallel(
        @burstFlight(.1, 0)
        @burstFlight(.4, 800)
        @burstFlight(.7, 1600)
      )

    )

  burstFlight: (height, delay) ->
    repeatPattern = (height) ->
      [
        [.2, height]
        [.2, height + .2]
        [.6, height]
        [1.1, height]
      ]
    @sequence(
      @wait(delay)
      @placeSquad DroneFlyer,
        amount: 4
        delay: 250
        options:
          path: repeatPattern(height)
          y: height
    )


  #oceanFighting: ->
    #@sequence(
      #@checkpoint @checkpointStart('Ocean', 0)

      #@parallel(
        #@sequence(
          #@wait 2000
          #@say 'General', 'We\'re under attack!?!', noise: 'low'
        #)
        #@swirlAttacks()
      #)
      #@swirlAttacks()
      #@parallel(
        #@gainHeight(-150, duration: 4000)
        #@wait 2000
        #@sequence(
          #@stalkerShootout()
          #@droneShip()
          #@stalkerShootout()
        #)
      #)
    #)

  midStageBossFight: ->
    @sequence(
      @setScenery('CoastStart')
      @sunRise(2)
      @checkpoint @checkpointStart('CoastStart', 2)

      @say('John', 'Enemy Navy Mothership approaching! Stay alert!')
      @async @showText 'Warning!', color: '#FF0000', mode: 'blink', blink_amount: 6, blink_speed: 100
      @mineSwarm()
      @parallel(
        @sequence(
          @wait 3000
          @placeSquad ShipBoss
        )
        @mineSwarm()
      )

      # temp end
      @wait 2000
    )

    #@sequence(
      #@checkpoint @checkpointStart('CoastStart', 1)
      #@mineSwarm()
      #@droneShip()
      #@sunRise(2)
      #@mineSwarm()
      #@parallel(
        #@say('John', 'Enemy Navy Mothership approaching! Stay alert!')
        #@placeSquad CrewShooters,
          #amount: 4
          #delay: 250
      #)
      #@shipBossFight()
      #@setScenery('BayStart')
      #@underWaterAttacks()
    #)

  #shipBossFight: ->
    #@sequence(
      #@checkpoint @checkpointStart('Ocean', 1)

      #@parallel(
        #@say('John', 'Time to show these monkeys who\'s boss')
        #@sequence(
          #@wait 30000
          #@setScenery('CoastStart')
          #@wait 5000
        #)
        #@placeSquad ShipBoss
        #@placeSquad CrewShooters,
          #amount: 5
          #delay: 2500
      #)
    #)

  #cityBay: ->
    #@sequence(
      #@checkpoint @checkpointStart('Bay', 2)
      #@setScenery('UnderBridge')
      #@parallel(
        #@placeSquad Stalker
        #@mineSwarm direction: 'left'
      #)

      #@sequence(
        #@stalkerShootout()
        #@parallel(
          #@placeSquad Stalker
          #@mineSwarm direction: 'left'
        #)
      #)
    #)

  #endStageBossfight: ->
    #@sequence(
      #@checkpoint @checkpointStart('BayFull', 2)
      ##@parallel(
        ##@if((-> @player(1).active), @drop(item: 'pool', inFrontOf: @player(1)))
        ##@if((-> @player(2).active), @drop(item: 'pool', inFrontOf: @player(2)))
      ##)
      #@mineSwarm direction: 'left'
      ##@parallel(
        ##@if((-> @player(1).active), @drop(item: 'pool', inFrontOf: @player(1)))
        ##@if((-> @player(2).active), @drop(item: 'pool', inFrontOf: @player(2)))
      ##)
      #@parallel(
        #@mineSwarm()
        #@sequence(
          #@wait 5000
          #@setScenery('UnderBridge')
        #)
      #)
      #@async @showText 'Warning!', color: '#FF0000', mode: 'blink', blink_amount: 6, blink_speed: 100
      #@while(
        #@waitForScenery('UnderBridge', event: 'enter')
        #@waitingRocketStrike()
      #)
      #@setSpeed 75
      #@waitForScenery('UnderBridge', event: 'inScreen')
      #@setSpeed 0
      #@checkpoint @checkpointStart('UnderBridge', 2)
      #@placeSquad Stage1BossStage1
      #@parallel(
        #@if((-> @player(1).active), @drop(item: 'healthu', inFrontOf: @player(1)))
        #@if((-> @player(2).active), @drop(item: 'healthu', inFrontOf: @player(2)))
      #)
      #@setSpeed 200
      #@wait 500
      #@parallel(
        #@if((-> @player(1).active), @drop(item: 'life', inFrontOf: @player(1)))
        #@if((-> @player(2).active), @drop(item: 'life', inFrontOf: @player(2)))
      #)
    #)

  #waitingRocketStrike: ->
    #@sequence(
      #@placeSquad Stage1BossRocketStrike,
        #amount: 6
        #delay: 150
        #options:
          #gridConfig:
            #x:
              #start: 1.1
              #steps: 1
              #stepSize: 0.05
            #y:
              #start: 0.125
              #steps: 12
              #stepSize: 0.05
      #@wait 200
    #)

  #swirlAttacks: ->
    #@attackWaves(
      #@parallel(
        #@repeat 2, @placeSquad Swirler,
          #amount: 4
          #delay: 250
          #options:
            #shootOnSight: yes
        #@repeat 2, @placeSquad Shooter,
          #amount: 4
          #delay: 250
          #options:
            #shootOnSight: yes
      #)
    #)

  #underWaterAttacks: ->
    #@sequence(
      #@placeSquad Stalker
      #@repeat 2, @stalkerShootout()
    #)

  sunRise: (fase = 0) ->
    script = switch fase
      when 0 then StartOfDawn
      when 1 then DayBreak
      when 2 then Morning

    @async @runScript(script)

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


  #stalkerShootout: ->
    #@parallel(
      #@placeSquad Stalker
      #@attackWaves(
        #@parallel(
          #@placeSquad Shooter,
            #amount: 4
            #delay: 250
            #options:
              #shootOnSight: yes
          #@placeSquad Swirler,
            #amount: 4
            #delay: 250
            #options:
              #shootOnSight: yes
        #)
      #)
    #)

  checkpointStart: (scenery, step) ->
    @sequence(
      @setScenery(scenery)
      @sunRise(step)
      @wait 2000
    )

module.exports =
  default: Stage1
