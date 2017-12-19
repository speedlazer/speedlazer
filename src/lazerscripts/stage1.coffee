{ LazerScript } = require('src/lib/LazerScript')
{ Swirler, Shooter, CrewShooters, Stalker } = require('./stage1/army_drone')
{ Stage1BossRocketStrike, Stage1BossStage1 } = require('./stage1/stage1boss')

CameraCrew  = require('./stage1/camera_crew').default
DroneShip   = require('./stage1/drone_ship').default
IntroBarrel = require('./stage1/barrel').default
JumpMine    = require('./stage1/jump_mine').default
ShipBoss    = require('./stage1/ship_boss').default
Stage2      = require('./stage2').default
SunRise     = require('./stage1/sunrise').default

class Stage1 extends LazerScript
  nextScript: Stage2

  assets: ->
    @loadAssets('explosion', 'playerShip', 'general')

  execute: ->
    @inventoryAdd 'weapon', 'lasers', marking: 'L'

    @inventoryAdd 'ship', 'life', marking: '❤', icon: 'heart'
    @inventoryAdd 'shipUpgrade', 'healthu', marking: '❤', icon: 'heart'
    @inventoryAdd 'shipBoost', 'healthb', marking: '❤', icon: 'heart'
    @inventoryAdd 'ship', 'points', marking: 'P', icon: 'star'

    @inventoryAdd 'weaponUpgrade', 'rapid', marking: 'RF', icon: 'rapidFireBoost'
    @inventoryAdd 'weaponUpgrade', 'damage', marking: 'D', icon: 'damageBoost'
    @inventoryAdd 'weaponUpgrade', 'aim', marking: 'A', icon: 'aimBoost'
    @inventoryAdd 'weaponUpgrade', 'speed', marking: 'S', icon: 'speedBoost'

    @inventoryAdd 'weaponBoost', 'rapidb', marking: 'RF', icon: 'rapidFireBoost'
    @inventoryAdd 'weaponBoost', 'aimb', marking: 'A', icon: 'aimBoost'
    @inventoryAdd 'weaponBoost', 'speedb', marking: 'S', icon: 'speedBoost'
    @inventoryAdd 'weaponBoost', 'damageb', marking: 'D', icon: 'damageBoost'

    @sequence(
      @setPowerupPool 'rapidb', 'speed', 'points', 'rapidb'
      @introText()
      @tutorial()
      @setPowerupPool 'aimb', 'speedb', 'rapidb', 'speed', 'aim', 'rapid'
      @droneTakeover()
      @oceanFighting()
      @setPowerupPool 'aim', 'speedb', 'rapidb', 'rapid', 'rapidb', 'aimb'
      @midStageBossFight()
      @cityBay()
      @setPowerupPool 'speed', 'rapid', 'aim', 'speed', 'rapid', 'aim'
      @endStageBossfight()
    )

  introText: ->
    @sequence(
      @setWeapons(['lasers'])
      @setSpeed 100
      @setScenery('Intro')
      @sunRise()
      @async @placeSquad(CameraCrew)
      @async @placeSquad(IntroBarrel, amount: 2, delay: 0)
      @if((-> @player(1).active and @player(2).active)
        @say 'General', 'Time to get the last 2 ships to the factory\n' +
          'to install the AI controlled defence systems', noise: 'low'
        @say 'General', 'Time to get the last ship to the factory\n' +
          'to install the AI controlled defence systems', noise: 'low'
      )
      #@say 'General', 'It saves lives when you no longer need soldiers,\n' +
      #'AI technology is the future after all.'
      #@wait 1500
    )

  tutorial: ->
    @sequence(
      @setSpeed 200
      @setScenery('Ocean')
      @say('General', 'We send some drones for some last manual target practice', noise: 'low')
      @parallel(
        @showText 'Get Ready', color: '#00FF00', mode: 'blink', blink_amount: 3, blink_speed: 300
        @say('John', 'Let\'s go!')
      )
      @parallel(
        @gainHeight(150, duration: 4000)
        @repeat(2, @sequence(
          @placeSquad Swirler,
            amount: 6
            delay: 250
            drop: 'pool'
          @wait(1000)
        ))
      )
      @say('General', 'Great job, now get the ship to the defence factory in the city\n' +
       'We will send some more target practice', noise: 'low')
      @placeSquad Shooter,
        amount: 6
        delay: 500
        drop: 'pool'
    )

  droneTakeover: ->
    @sequence(
      @parallel(
        @say('John', 'What are those drones doing there!?')
        @placeSquad CrewShooters,
          amount: 4
          delay: 750
          drop: 'pool'
      )
      @say('General', 'They do not respond to our commands anymore!\nOur defence AI has been hacked!', noise: 'low')
      @async @chapterTitle(1, 'Hacked')
    )

  oceanFighting: ->
    @sequence(
      @checkpoint @checkpointStart('Ocean', 45000)

      @parallel(
        @sequence(
          @wait 2000
          @say 'General', 'We\'re under attack!?!', noise: 'low'
        )
        @swirlAttacks()
      )
      @setScenery('CoastStart')
      @swirlAttacks()
      @parallel(
        @gainHeight(-150, duration: 4000)
        @wait 2000
        @sequence(
          @stalkerShootout()
          @droneShip()
          @stalkerShootout()
        )
      )
    )

  midStageBossFight: ->
    @sequence(
      @checkpoint @checkpointStart('CoastStart', 93000)
      @mineSwarm()
      @droneShip()
      @mineSwarm()
      @shipBossFight() # Bossfight
      @setScenery('BayStart')
      @underWaterAttacks()
    )

  shipBossFight: ->
    @sequence(
      @checkpoint @checkpointStart('Coast', 93000)
      @placeSquad ShipBoss
    )

  cityBay: ->
    @sequence(
      @checkpoint @checkpointStart('Bay', 131000)
      @setScenery('UnderBridge')
      @parallel(
        @placeSquad Stalker,
          drop: 'pool'
        @mineSwarm direction: 'left'
      )

      @sequence(
        @stalkerShootout()
        @parallel(
          @placeSquad Stalker,
            drop: 'pool'
          @mineSwarm direction: 'left'
        )
      )
    )

  endStageBossfight: ->
    @sequence(
      @checkpoint @checkpointStart('BayFull', 168000)
      @parallel(
        @if((-> @player(1).active), @drop(item: 'pool', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'pool', inFrontOf: @player(2)))
      )
      @mineSwarm direction: 'left'
      @parallel(
        @if((-> @player(1).active), @drop(item: 'pool', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'pool', inFrontOf: @player(2)))
      )
      @parallel(
        @mineSwarm()
        @sequence(
          @wait 5000
          @setScenery('UnderBridge')
        )
      )
      @async @showText 'Warning!', color: '#FF0000', mode: 'blink'
      @while(
        @waitForScenery('UnderBridge', event: 'enter')
        @waitingRocketStrike()
      )
      @setSpeed 75
      @waitForScenery('UnderBridge', event: 'inScreen')
      @setSpeed 0
      @checkpoint @checkpointStart('UnderBridge', 203000)
      @placeSquad Stage1BossStage1
      @parallel(
        @if((-> @player(1).active), @drop(item: 'healthu', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'healthu', inFrontOf: @player(2)))
      )
      @setSpeed 200
      @wait 500
      @parallel(
        @if((-> @player(1).active), @drop(item: 'rapidb', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'rapidb', inFrontOf: @player(2)))
      )
      @wait 500
      @parallel(
        @if((-> @player(1).active), @drop(item: 'speedb', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'speedb', inFrontOf: @player(2)))
      )
    )

  waitingRocketStrike: ->
    @sequence(
      @placeSquad Stage1BossRocketStrike,
        amount: 6
        delay: 150
        options:
          gridConfig:
            x:
              start: 1.1
              steps: 1
              stepSize: 0.05
            y:
              start: 0.125
              steps: 12
              stepSize: 0.05
      @wait 200
    )

  swirlAttacks: ->
    @attackWaves(
      @parallel(
        @repeat 2, @placeSquad Swirler,
          amount: 8
          delay: 500
          options:
            shootOnSight: yes
        @repeat 2, @placeSquad Shooter,
          amount: 8
          delay: 500
          options:
            shootOnSight: yes
      )
      drop: 'pool'
    )

  underWaterAttacks: ->
    @sequence(
      @placeSquad Stalker,
        drop: 'pool'
      @repeat 2, @stalkerShootout()
    )

  underWaterAttacks2: ->

  sunRise: (options = { skipTo: 0 }) ->
    @async @runScript(SunRise, _.extend({ speed: 2 }, options))

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

  droneShip: ->
    @placeSquad DroneShip,
      drop: 'pool'

  stalkerShootout: ->
    @parallel(
      @placeSquad Stalker,
        drop: 'pool'
      @attackWaves(
        @parallel(
          @placeSquad Shooter,
            amount: 8
            delay: 500
            options:
              shootOnSight: yes
          @placeSquad Swirler,
            amount: 8
            delay: 500
            options:
              shootOnSight: yes
        )
        drop: 'pool'
      )
    )

  checkpointStart: (scenery, sunSkip) ->
    @sequence(
      @setScenery(scenery)
      @sunRise(skipTo: sunSkip)
      @wait 2000
    )

module.exports =
  default: Stage1
