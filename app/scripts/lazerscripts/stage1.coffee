require('./stage1/army_drone')
require('./stage1/barrel')
require('./stage1/camera_crew')
require('./stage1/drone_ship')
require('./stage1/heli_attack')
require('./stage1/jump_mine')
require('./stage1/mine_cannon')
require('./stage1/mine_wall')
require('./stage1/player_clone')
require('./stage1/ship_boss')
require('./stage1/stage1boss')
require('./stage1/sunrise')
require('./stage1/sunset')

class Game.Scripts.Stage1 extends Game.LazerScript
  nextScript: 'Stage2'

  assets: ->
    @loadAssets('explosion', 'playerShip', 'general')

  execute: ->
    @inventoryAdd 'weapon', 'lasers', marking: 'L'

    @inventoryAdd 'ship', 'life', marking: '❤', icon: 'heart'
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
      @enteringLand()
      @cityBay()
      @setPowerupPool 'speed', 'rapid', 'aim', 'speed', 'rapid', 'aim'
      @midstageBossfight()
      @bossfightReward()
      @skylineFighting()
      @highSkylineFighting()
    )

  introText: ->
    @sequence(
      @setWeapons(['lasers'])
      @setSpeed 100
      @setScenery('Intro')
      @sunRise()
      @async @placeSquad(Game.Scripts.CameraCrew)
      @async @placeSquad(Game.Scripts.IntroBarrel, amount: 2, delay: 0)
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
          @placeSquad Game.Scripts.Swirler,
            amount: 6
            delay: 250
            drop: 'pool'
          @wait(1000)
        ))
      )
      @say('General', 'Great job, now get the ship to the defence factory in the city\n' +
       'We will send some more target practice', noise: 'low')
      @placeSquad Game.Scripts.Shooter,
        amount: 6
        delay: 500
        drop: 'pool'
    )

  droneTakeover: ->
    @sequence(
      @parallel(
        @say('John', 'What are those drones doing there!?')
        @placeSquad Game.Scripts.CrewShooters,
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

  enteringLand: ->
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
      @placeSquad Game.Scripts.ShipBoss
    )

  cityBay: ->
    @sequence(
      @checkpoint @checkpointStart('Bay', 131000)
      @setScenery('UnderBridge')
      @parallel(
        @placeSquad Game.Scripts.Stalker,
          drop: 'pool'
        @mineSwarm direction: 'left'
      )

      @sequence(
        @stalkerShootout()
        @parallel(
          @placeSquad Game.Scripts.Stalker,
            drop: 'pool'
          @mineSwarm direction: 'left'
        )
      )
    )

  midstageBossfight: ->
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
      @placeSquad Game.Scripts.Stage1BossStage1
      @parallel(
        @if((-> @player(1).active), @drop(item: 'life', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'life', inFrontOf: @player(2)))
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
      @placeSquad Game.Scripts.Stage1BossRocketStrike,
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
        @repeat 2, @placeSquad Game.Scripts.Swirler,
          amount: 8
          delay: 500
          options:
            shootOnSight: yes
        @repeat 2, @placeSquad Game.Scripts.Shooter,
          amount: 8
          delay: 500
          options:
            shootOnSight: yes
      )
      drop: 'pool'
    )

  underWaterAttacks: ->
    @sequence(
      @placeSquad Game.Scripts.Stalker,
        drop: 'pool'
      @repeat 2, @stalkerShootout()
    )

  underWaterAttacks2: ->

  sunRise: (options = { skipTo: 0 }) ->
    @async @runScript(Game.Scripts.SunRise, _.extend({ speed: 2 }, options))

  mineSwarm: (options = { direction: 'right' })->
    @placeSquad Game.Scripts.JumpMine,
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
    @placeSquad Game.Scripts.DroneShip,
      drop: 'pool'

  stalkerShootout: ->
    @parallel(
      @placeSquad Game.Scripts.Stalker,
        drop: 'pool'
      @attackWaves(
        @parallel(
          @placeSquad Game.Scripts.Shooter,
            amount: 8
            delay: 500
            options:
              shootOnSight: yes
          @placeSquad Game.Scripts.Swirler,
            amount: 8
            delay: 500
            options:
              shootOnSight: yes
        )
        drop: 'pool'
      )
    )

  bossfightReward: ->
    @sequence(
      @checkpoint @checkpointMidStage('BayFull', 400000)
      @say('General', 'Hunt him down! We need that AI control back!', noise: 'low')
      @setSpeed 200

      @setPowerupPool 'rapidb', 'speedb', 'aimb', 'speed', 'rapidb'

      @parallel(
        @sequence(
          @wait 4000
          @gainHeight(800, duration: 14000)
        )
        @sequence(
          @stalkerShootout()
          @setScenery('Skyline')
          @placeSquad Game.Scripts.Shooter,
            amount: 8
            delay: 500
            drop: 'pool'
            options:
              shootOnSight: yes
          @attackWaves(
            @parallel(
              @placeSquad Game.Scripts.Shooter,
                amount: 8
                delay: 500
                options:
                  shootOnSight: yes
              @placeSquad Game.Scripts.Swirler,
                amount: 8
                delay: 500
                options:
                  shootOnSight: yes
            )
            drop: 'pool'
          )
        )
      )
    )

  skylineFighting: ->
    @sequence(
      @setSpeed 100
      @checkpoint @checkpointMidStage('Skyline', 450000)
      @changeSeaLevel 500

      @setPowerupPool 'damageb', 'damage', 'aimb', 'rapidb', 'damage', 'damageb'
      @attackWaves(
        @parallel(
          @placeSquad Game.Scripts.ScraperFlyer,
            amount: 8
            delay: 500
          @placeSquad Game.Scripts.Shooter,
            amount: 8
            delay: 500
            options:
              shootOnSight: yes
        )
        drop: 'pool'
      )
      @parallel(
        @attackWaves(
          @parallel(
            @placeSquad Game.Scripts.ScraperFlyer,
              amount: 8
              delay: 500
            @placeSquad Game.Scripts.Shooter,
              amount: 8
              delay: 500
              options:
                shootOnSight: yes
          )
          drop: 'pool'
        )
        @cloneEncounter()
      )
      @placeSquad Game.Scripts.Stage1BossPopup
      @setScenery('Skyline')
      @parallel(
        @attackWaves(
          @sequence(
            @placeSquad Game.Scripts.ScraperFlyer,
              amount: 6
              delay: 500
            @placeSquad Game.Scripts.ScraperFlyer,
              amount: 8
              delay: 500
          )
          drop: 'pool'
        )
        @sequence(
          @wait 3000
          @placeSquad Game.Scripts.Shooter,
            amount: 4
            delay: 750
            drop: 'pool'
            options:
              shootOnSight: yes
          @placeSquad Game.Scripts.HeliAttack,
            drop: 'pool'
        )
      )
    )

  highSkylineFighting: ->
    @sequence(
      @parallel(
        @placeSquad Game.Scripts.Stage1BossPopup
        @cloneEncounter()
      )

      @gainHeight(300, duration: 4000)
      @checkpoint @checkpointEndStage('Skyline', 500000)

      @parallel(
        @repeat 2, @cloneEncounter()
        @placeSquad Game.Scripts.HeliAttack,
          drop: 'pool'
          amount: 2
          delay: 5000
      )

      @async @showText 'Warning!', color: '#FF0000', mode: 'blink'
      @setScenery 'SkylineBase'
      @while(
        @wait 3000
        @waitingRocketStrike()
      )
      @placeSquad Game.Scripts.Stage1BossLeaving
      @say 'General', 'He is going to the military complex!\nBut we cant get through those shields now...', noise: 'low'
    )

  cloneEncounter: ->
    @attackWaves(
      @parallel(
        @sequence(
          @wait 4000
          @placeSquad Game.Scripts.PlayerClone,
            options:
              from: 'top'
        )
        @placeSquad Game.Scripts.PlayerClone,
          options:
            from: 'bottom'
      )
      drop: 'pool'
    )


  checkpointStart: (scenery, sunSkip) ->
    @sequence(
      @setScenery(scenery)
      @sunRise(skipTo: sunSkip)
      @wait 2000
    )

  checkpointMidStage: (scenery, sunSkip) ->
    @sequence(
      @setScenery(scenery)
      @sunRise(skipTo: sunSkip)
      @wait 2000
    )

  checkpointEndStage: (scenery, sunSkip) ->
    @sequence(
      @setScenery(scenery)
      @sunRise(skipTo: sunSkip)
      @parallel(
        @if((-> @player(1).active), @drop(item: 'damage', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'damage', inFrontOf: @player(2)))
      )
      @wait 2000
      @parallel(
        @if((-> @player(1).active), @drop(item: 'rapid', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'speed', inFrontOf: @player(2)))
      )
    )

