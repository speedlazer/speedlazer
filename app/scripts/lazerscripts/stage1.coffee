Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1 extends Game.LazerScript
  nextScript: 'Stage1End'

  assets: ->
    @loadAssets('explosion', 'playerShip')

  execute: ->
    @inventoryAdd 'weapon', 'lasers', marking: 'L'

    @inventoryAdd 'ship', 'life', marking: '❤'
    @inventoryAdd 'ship', 'points', marking: 'P'

    @inventoryAdd 'weaponUpgrade', 'rapid', marking: 'RF'
    @inventoryAdd 'weaponUpgrade', 'damage', marking: 'D'
    @inventoryAdd 'weaponUpgrade', 'aim', marking: 'A'
    @inventoryAdd 'weaponUpgrade', 'speed', marking: 'S'

    @inventoryAdd 'weaponBoost', 'rapidb', marking: 'RF'
    @inventoryAdd 'weaponBoost', 'aimb', marking: 'A'
    @inventoryAdd 'weaponBoost', 'speedb', marking: 'S'
    @inventoryAdd 'weaponBoost', 'damageb', marking: 'D'

    @sequence(
      @setPowerupPool 'rapidb', 'speed'
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

      @checkpoint @checkpointMidStage('BayFull', 400000)
      @say('General', 'Hunt him down!')
      @setSpeed 150

      @setPowerupPool 'rapidb', 'speedb', 'aimb', 'speed', 'rapidb'

      @placeSquad Game.Scripts.Shooter,
        amount: 8
        delay: 500
        drop: 'pool'
        options:
          shootOnSight: yes

      @repeat 2, @stalkerShootout()

      @setScenery('Skyline')
      @parallel(
        @sequence(
          @wait 3000
          @gainHeight(300, duration: 4000)
          @placeSquad Game.Scripts.Shooter,
            amount: 8
            delay: 500
            drop: 'pool'
            options:
              shootOnSight: yes
        )
        @placeSquad Game.Scripts.Stage1BossPopup
      )
      @setSpeed 100
      @checkpoint @checkpointMidStage('Skyline', 450000)

      @setPowerupPool 'damageb', 'damage', 'aimb', 'rapidb', 'damage', 'damageb'
      @placeSquad Game.Scripts.ScraperFlyer,
        amount: 8
        delay: 500
        drop: 'pool'
      @parallel(
        @placeSquad Game.Scripts.ScraperFlyer,
          amount: 8
          delay: 500
          drop: 'pool'
        @cloneEncounter()
      )
      @cityFighting()
      @parallel(
        @placeSquad Game.Scripts.Stage1BossPopup
        @cloneEncounter()
      )

      @gainHeight(300, duration: 4000)
      @checkpoint @checkpointMidStage('Skyline', 500000)

      @parallel(
        @repeat 2, @cloneEncounter()
        @placeSquad Game.Scripts.HeliAttack
      )

      @setScenery 'SkylineBase'
      @while(
        @wait 3000
        @sequence(
          @pickTarget('PlayerControlledShip')
          @placeSquad Game.Scripts.Stage1BossRocket,
            options:
              location: @targetLocation(x: 1.3)
          @wait 200
        )
      )
      @placeSquad Game.Scripts.Stage1BossLeaving
      @say 'General', 'He went to the military complex!\nBut we cant get through those shields now...'
      @wait 3000
    )

  introText: ->
    @sequence(
      @setWeapons(['lasers'])
      @setSpeed 100
      @setScenery('Intro')
      @sunRise()
      @cameraCrew()
      @async @runScript Game.Scripts.IntroBarrel
      @wait 2000 # Time for more players to activate
      @if((-> @player(1).active and !@player(2).active)
        @sequence(
          @say 'General', 'Time to get the last ship to the factory\n' +
            'to install the automated defence systems'
          @say 'John', 'I hate that we pilots will be without jobs soon'
        )
      )
      @if((-> !@player(1).active and @player(2).active)
        @sequence(
          @say 'General', 'Time to get the last ship to the factory\n' +
            'to install the automated defence systems'
          @say 'Jim', 'Man I don\'t trust that AI stuff for one bit'
        )
      )
      @if((-> @player(1).active and @player(2).active)
        @sequence(
          @say 'General', 'Time to get the last 2 ships to the factory\n' +
            'to install the automated defence systems'
          @say 'John', 'I have a feeling that we will be without jobs soon'
        )
      )
      @say 'General', 'It saves lives when you no longer need soldiers,\n' +
      'AI technology is the future after all.'

      @wait 1500
    )

  tutorial: ->
    @sequence(
      @setScenery('Ocean')
      @say('General', 'We send some drones for some last manual target practice')
      @parallel(
        @gainHeight(150, duration: 4000)
        @repeat(2, @sequence(
          @wait(1000)
          @placeSquad Game.Scripts.Swirler,
            amount: 6
            delay: 250
            drop: 'pool'
        ))
      )
    )

  droneTakeover: ->
    @sequence(
      @placeSquad Game.Scripts.CrewShooters,
        amount: 4
        delay: 750
        drop: 'pool'
      @say('General', 'What is going on with our drones?')
      @say('General', 'They do not respond to our commands anymore!\nThe defence AI has been hacked!')
      @async @chapterTitle(1, 'Hacked')
      @setSpeed 150
    )

  cameraCrew: ->
    @async @placeSquad(Game.Scripts.CameraCrew)

  oceanFighting: ->
    @sequence(
      @checkpoint @checkpointStart('Ocean', 42000)

      @parallel(
        @sequence(
          @wait 2000
          @say 'General', 'We\'re under attack!?!'
        )
        @swirlAttacks()
      )
      @setScenery('CoastStart')
      @swirlAttacks()
      @parallel(
        @gainHeight(-150, duration: 4000)
        @sequence(
          @wait 2000
          @underWaterAttacks()
        )
      )
    )

  enteringLand: ->
    @sequence(
      @checkpoint @checkpointStart('CoastStart', 110000)
      @setScenery('BayStart')
      @mineSwarm()
      @underWaterAttacks()
      @parallel(
        @swirlAttacks()
        @mineSwarm()
      )
    )

  cityBay: ->
    @sequence(
      @checkpoint @checkpointStart('Bay', 173000)
      @setScenery('UnderBridge')
      @parallel(
        @placeSquad Game.Scripts.Stalker,
          drop: 'pool'
        @mineSwarm direction: 'left'
      )

      @parallel(
        @sequence(
          @stalkerShootout()
          @parallel(
            @placeSquad Game.Scripts.Stalker,
              drop: 'pool'
            @mineSwarm direction: 'left'
          )
          @swirlAttacks()
        )
      )
    )

  midstageBossfight: ->
    @sequence(
      @checkpoint @checkpointStart('BayFull', 226000)
      @parallel(
        @if((-> @player(1).active), @drop(item: 'pool', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'pool', inFrontOf: @player(2)))
      )
      @mineSwarm()
      @parallel(
        @if((-> @player(1).active), @drop(item: 'pool', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'pool', inFrontOf: @player(2)))
      )
      @mineSwarm direction: 'left'
      @parallel(
        @if((-> @player(1).active), @drop(item: 'pool', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'pool', inFrontOf: @player(2)))
      )
      @mineSwarm()
      @setScenery('UnderBridge')
      @async @showText 'Warning!', color: '#FF0000', mode: 'blink'
      @while(
        @waitForScenery('UnderBridge', event: 'enter')
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
      )
      @setSpeed 75
      @waitForScenery('UnderBridge', event: 'inScreen')
      @setSpeed 0
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

  sunRise: (options = { skipTo: 0 }) ->
    @async @runScript(Game.Scripts.SunRise, options)

  mineSwarm: (options = { direction: 'right' })->
    @placeSquad Game.Scripts.JumpMine,
      amount: 20
      delay: 100
      options:
        gridConfig:
          x:
            start: 0.1
            steps: 16
            stepSize: 0.05
          y:
            start: 0.125
            steps: 12
            stepSize: 0.05
        points: options.points ? yes
        direction: options.direction

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

  cityFighting: ->
    @sequence(
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
          @placeSquad Game.Scripts.Swirler,
            amount: 4
            delay: 750
            drop: 'pool'
            options:
              shootOnSight: yes
          @placeSquad Game.Scripts.HeliAttack
        )
      )
    )

  cloneEncounter: ->
    @parallel(
      @sequence(
        @wait 4000
        @placeSquad Game.Scripts.PlayerClone,
          drop: 'pool'
          options:
            from: 'top'
      )
      @placeSquad Game.Scripts.PlayerClone,
        drop: 'pool'
        options:
          from: 'bottom'
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

