Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1 extends Game.LazerScript
  nextScript: 'Stage2'

  assets: ->
    @loadAssets('shadow', 'explosion', 'playerShip')

  execute: ->
    @inventoryAdd 'weapon', 'lasers', marking: 'L'
    @inventoryAdd 'ship', 'life', marking: '❤'
    @inventoryAdd 'weaponUpgrade', 'rapid', marking: 'RF'
    @inventoryAdd 'weaponUpgrade', 'damage', marking: 'D'
    @inventoryAdd 'weaponUpgrade', 'aim', marking: 'A'
    @inventoryAdd 'weaponUpgrade', 'speed', marking: 'S'

    @sequence(
      @setPowerupPool 'rapid', 'damage'
      @setPowerupPool 'life'
      @introText()
      @tutorial()
      @setPowerupPool 'aim', 'speed', 'rapid', 'speed', 'speed'
      @droneTakeover()
      @oceanFighting()
      @setPowerupPool 'aim', 'speed', 'rapid', 'damage', 'rapid'
      @enteringLand()
      @cityBay()
      @setPowerupPool 'speed', 'rapid', 'rapid', 'damage'
      @midstageBossfight()

      @checkpoint @checkpointMidStage('BayFull', 400000)
      @say('General', 'Hunt him down!')
      @setSpeed 150
      @placeSquad Game.Scripts.Shooter,
        amount: 4
        delay: 1000
        drop: 'pool'
        options:
          shootOnSight: yes

      # Warming up of new weapon
      @repeat 3, @stalkerShootout()

      @parallel(
        @sequence(
          @wait 3000
          @gainHeight(300, duration: 4000)
          @placeSquad Game.Scripts.Shooter,
            amount: 4
            delay: 1000
            drop: 'pool'
            options:
              shootOnSight: yes
        )
        @placeSquad Game.Scripts.Stage1BossPopup
      )
      @setSpeed 100

      @parallel(
        @placeSquad Game.Scripts.ScraperFlyer,
          amount: 8
          delay: 750
          drop: 'pool'
        @cloneEncounter()
      )
      @cityFighting()
      @parallel(
        @placeSquad Game.Scripts.Stage1BossPopup
        @cloneEncounter()
      )

      @gainHeight(300, duration: 4000)

      @checkpoint @checkpointMidStage('Skyline', 450000)
      @repeat 2, @parallel(
        @cloneEncounter()
        @placeSquad Game.Scripts.PlayerClone,
          options:
            from: 'middle'
          drop: 'pool'
      )
      @setScenery 'SkylineBase'
      @while(
        @wait 4000
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
      @if((-> @player(1).active and !@player(2).active)
        @sequence(
          @say 'John', 'I\'ll try to find another way in!'
          @say 'General', 'There are rumours about an underground entrance'
          @say 'John', 'Ok I\'ll check it out'
        )
      )
      @if((-> !@player(1).active and @player(2).active)
        @sequence(
          @say 'Jim', 'I\'ll use the underground tunnels!'
          @say 'General', 'How do you know about those...\n' +
            'that\'s classified info!'
        )
      )
      @if((-> @player(1).active and @player(2).active)
        @sequence(
          @say 'John', 'We\'ll try to find another way in!'
          @say 'Jim', 'We can use the underground tunnels!'
          @say 'General', 'How do you know about those...\n' +
            'that\'s classified info!'
        )
      )
    )

  introText: ->
    @sequence(
      @setWeapons(['lasers'])
      @setSpeed 50
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
          @say 'John', 'I hate that we pilots will be without jobs soon'
        )
      )
      @say 'General', 'It saves lives when you no longer need soldiers,\n' +
      'AI technology is the future after all.'

      @wait 3000
    )

  tutorial: ->
    @sequence(
      @setScenery('Ocean')
      @say('General', 'We send some drones for some last manual target practice')
      @attackWaves(
        @repeat(2, @sequence(
          @dropWeaponsForEachPlayer()
          @wait(2000)
          @placeSquad Game.Scripts.Swirler,
            amount: 4
            delay: 500
        ))
        drop: 'pool'
      )
    )

  dropWeaponsForEachPlayer: ->
    @parallel(
      @if((-> @player(1).active and !@player(1).has('lasers')), @drop(item: 'lasers', inFrontOf: @player(1)))
      @if((-> @player(2).active and !@player(2).has('lasers')), @drop(item: 'lasers', inFrontOf: @player(2)))
    )

  dropDiagonalsForEachPlayer: ->
    @parallel(
      @if((-> @player(1).active and !@player(1).has('diagonals')), @drop(item: 'diagonals', inFrontOf: @player(1)))
      @if((-> @player(2).active and !@player(2).has('diagonals')), @drop(item: 'diagonals', inFrontOf: @player(2)))
    )

  droneTakeover: ->
    @sequence(
      @placeSquad Game.Scripts.CrewShooters,
        amount: 4
        delay: 750
        drop: 'pool'
      @say('General', 'What the hell is happening with our drones?')
      @say('General', 'They do not respond to our commands anymore!\nThe defence AI has been hacked!')
      @chapterTitle(1, 'Hacked')
    )

  cameraCrew: ->
    @async @placeSquad(Game.Scripts.CameraCrew)

  oceanFighting: ->
    @sequence(
      @checkpoint @checkpointStart('Ocean', 42000)

      @parallel(
        @sequence(
          @wait 2000
          @say 'General', 'We\'re under attack!'
        )
        @swirlAttacks()
      )
      @setScenery('CoastStart')
      @swirlAttacks()
      @underWaterAttacks()
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
        @placeSquad Game.Scripts.Stalker
        @mineSwarm direction: 'left'
      )

      @parallel(
        @sequence(
          @stalkerShootout()
          @parallel(
            @placeSquad Game.Scripts.Stalker
            @mineSwarm direction: 'left'
          )
          @swirlAttacks()
        )
      )
    )

  midstageBossfight: ->
    @sequence(
      @checkpoint @checkpointStart('BayFull', 226000)
      @setScenery('UnderBridge')
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
      @showText 'Warning!', color: '#FF0000', mode: 'blink'
      @while(
        @waitForScenery('UnderBridge', event: 'inScreen')
        @sequence(
          @pickTarget('PlayerControlledShip')
          @placeSquad Game.Scripts.Stage1BossRocket,
            options:
              location: @targetLocation(x: 1.3)
          @wait 200
        )
      )
      @setSpeed 0
      @placeSquad Game.Scripts.Stage1BossStage1

      @setSpeed 50
    )

  swirlAttacks: ->
    @attackWaves(
      @parallel(
        @repeat 2, @placeSquad Game.Scripts.Swirler,
          amount: 4
          delay: 500
          options:
            shootOnSight: yes
        @repeat 2, @placeSquad Game.Scripts.Shooter,
          amount: 4
          delay: 500
          options:
            shootOnSight: yes
      )
      drop: 'pool'
    )

  underWaterAttacks: ->
    @sequence(
      @placeSquad Game.Scripts.Stalker
      @repeat 2, @stalkerShootout()
    )

  sunRise: (options = { skipTo: 0 }) ->
    @async @runScript(Game.Scripts.SunRise, options)

  mineSwarm: (options = { direction: 'right' })->
    @placeSquad Game.Scripts.JumpMine,
      amount: 14
      delay: 300
      options:
        gridConfig:
          x:
            start: 0.3
            steps: 12
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
            amount: 4
            delay: 1000
            options:
              shootOnSight: yes
          @placeSquad Game.Scripts.Swirler,
            amount: 4
            delay: 1000
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
              amount: 4
              delay: 750
            @placeSquad Game.Scripts.ScraperFlyer,
              amount: 6
              delay: 750
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
        )
      )
    )

  cloneEncounter: ->
    @attackWaves(
      @parallel(
        @sequence(
          @wait 2000
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
      @parallel(
        @setScenery(scenery)
        @sunRise(skipTo: sunSkip)
      )
      @wait 2000
    )

  checkpointMidStage: (scenery, sunSkip) ->
    @sequence(
      @parallel(
        @sunRise(skipTo: sunSkip)
        @setScenery(scenery)
      )
      @dropDiagonalsForEachPlayer()
      @wait 6000
    )

