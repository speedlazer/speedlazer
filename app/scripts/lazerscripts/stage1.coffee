Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1 extends Game.LazerScript
  metadata:
    namespace: 'City'
    armedPlayers: 'lasers'
    speed: 50
    title: 'City'

  assets: ->
    @loadAssets(
      sprites:
        'shadow.png':
          tile: 35
          tileh: 20
          map:
            shadow: [0,0]
          paddingX: 1
    )

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L')

    @sequence(
      @introText()
      @tutorial()
      @droneTakeover()
      @oceanFighting()
      @enteringLand()
      @cityBay()
      @midstageBossfight()

      @checkpoint @checkpointMidStage('Bay')
      @say('General', 'Hunt him down!')
      @setSpeed 100
      @placeSquad Game.Scripts.Shooter,
        amount: 4
        delay: 1000
        drop: 'lasers'
        options:
          shootOnSight: yes

      @parallel(
        @sequence(
          @wait 3000
          @gainHeight(300, duration: 4000)
          @placeSquad Game.Scripts.Shooter,
            amount: 4
            delay: 1000
            drop: 'lasers'
            options:
              shootOnSight: yes
        )
        @placeSquad Game.Scripts.Stage1BossPopup
      )

      @cityFighting()

      @say 'Game', 'End of gameplay for now... \nStarting endless enemies'
      @repeat @mineSwarm()
    )

  introText: ->
    @sequence(
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
      @repeat(2, @sequence(
        @dropWeaponsForEachPlayer()
        @wait(2000)
        @placeSquad Game.Scripts.Swirler,
          amount: 4
          delay: 500
          drop: 'lasers'
      ))
    )

  dropWeaponsForEachPlayer: ->
    @parallel(
      @if((-> @player(1).active and !@player(1).has('lasers')), @drop(item: 'lasers', inFrontOf: @player(1)))
      @if((-> @player(2).active and !@player(2).has('lasers')), @drop(item: 'lasers', inFrontOf: @player(2)))
    )

  droneTakeover: ->
    @parallel(
      @placeSquad Game.Scripts.CrewShooters,
        amount: 4
        delay: 750
        drop: 'lasers'
      @sequence(
        @say('General', 'What the hell is happening with our drones?')
        @say('General', 'They do not respond to our commands anymore!\nThe defence AI has been compromised!')
      )
    )

  cameraCrew: ->
    @async @runScript(Game.Scripts.CameraCrew)

  oceanFighting: ->
    @sequence(
      @checkpoint @checkpointStart('Ocean', 60000)

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
      @checkpoint @checkpointStart('CoastStart', 150000)
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
      @checkpoint @checkpointStart('Bay', 240000)
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
      @checkpoint @checkpointStart('Bay', 300000)
      @setScenery('UnderBridge')
      @mineSwarm()
      @mineSwarm direction: 'left'
      @mineSwarm()
      @waitForScenery('UnderBridge', event: 'inScreen')
      @setSpeed 0
      @placeSquad Game.Scripts.Stage1BossStage1

      @setSpeed 50
    )

  swirlAttacks: ->
    @parallel(
      @repeat 2, @placeSquad Game.Scripts.Swirler,
        amount: 4
        delay: 500
        drop: 'lasers'
        options:
          shootOnSight: yes
      @repeat 2, @placeSquad Game.Scripts.Shooter,
        amount: 4
        delay: 500
        drop: 'lasers'
        options:
          shootOnSight: yes
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
        grid: new Game.LocationGrid
          x:
            start: 0.3
            steps: 12
            stepSize: 0.05
          y:
            start: 0.125
            steps: 12
            stepSize: 0.05

        direction: options.direction

  stalkerShootout: ->
    @parallel(
      @placeSquad Game.Scripts.Stalker
      @placeSquad Game.Scripts.Shooter,
        amount: 4
        delay: 1000
        drop: 'lasers'
        options:
          shootOnSight: yes
      @placeSquad Game.Scripts.Swirler,
        amount: 4
        delay: 1000
        drop: 'lasers'
        options:
          shootOnSight: yes
    )

  cityFighting: ->
    @sequence(
      @setScenery('Skyline')
      @placeSquad Game.Scripts.ScraperFlyer,
        amount: 8
        delay: 750
      @placeSquad Game.Scripts.Swirler,
        amount: 8
        delay: 750
        options:
          shootOnSight: yes
      @placeSquad Game.Scripts.Stage1BossPopup
    )

  checkpointStart: (scenery, sunSkip) ->
    @parallel(
      @setScenery(scenery)
      @sunRise(skipTo: sunSkip)
      @wait 2000
    )

  checkpointMidStage: (scenery) ->
    @parallel(
      @setScenery(scenery)
      @sunRise(skipTo: 300000)
      @wait 2000
    )

