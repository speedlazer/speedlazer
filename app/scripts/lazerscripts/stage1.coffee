Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1 extends Game.LazerScript
  metadata:
    namespace: 'City'
    speed: 50

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L')
    @inventoryAdd 'item', 'rockets', ->
      Crafty.e('PowerUp').powerUp(contains: 'rockets', marking: 'R')

    @sequence(
      @setScenery('Intro')
      @async @runScript Game.Scripts.IntroBarrel
      @sunRise()
      @introText()
      @tutorial()
      @droneTakeover()

      @checkpoint @checkpointStart('Ocean', 60000)

      @parallel(
        @sequence(
          @wait 2000
          @say 'General', 'Forget that museum. We\'re under attack!'
        )
        @swirlAttacks()
      )
      @swirlAttacks()
      @setScenery('CoastStart')
      @underWaterAttacks()

      @checkpoint @checkpointStart('CoastStart', 150000)

      @mineSwarm()
      @loadAssets images: ['city.png']
      @setScenery('Bay')
      @underWaterAttacks()
      @parallel(
        @swirlAttacks()
        @mineSwarm()
      )
      @parallel(
        @placeSquad Game.Scripts.Stalker
        @mineSwarm direction: 'left'
      )

      @checkpoint @checkpointStart('Bay', 240000)

      @setScenery('UnderBridge')
      @parallel(
        @sequence(
          @stalkerShootout()
          @parallel(
            @placeSquad Game.Scripts.Stalker
            @mineSwarm direction: 'left'
          )
          @swirlAttacks()
        )
        @waitForScenery('UnderBridge', event: 'leave')
      )

      @checkpoint @checkpointStart('Bay', 300000)

      @setScenery('UnderBridge')
      @mineSwarm()
      @mineSwarm direction: 'left'
      @mineSwarm()
      @waitForScenery('UnderBridge', event: 'inScreen')
      @setSpeed 0
      @placeSquad Game.Scripts.Stage1BossStage1

      @setSpeed 50
      @checkpoint @checkpointMidStage('Bay')
      @say('General', 'Hunt him down!')
      @setSpeed 100
      @dropRocketForEachPlayer()
      @placeSquad Game.Scripts.StalkerChain,
        amount: 4
        delay: 500
        drop: 'rockets'
        options:
          grid: new Game.LocationGrid
            y:
              start: 150
              steps: 4
              stepSize: 80

      @parallel(
        @sequence(
          @wait 3000
          @gainHeight(300, duration: 4000)
        )
        @placeSquad Game.Scripts.Stage1BossPopup
      )

      @cityFighting()

      #@waitForScenery('Skyline', event: 'leave')
      @disableWeapons()
      @showScore(1, 'City')
      @enableWeapons()
      @say 'Game', 'End of gameplay for now... \nStarting endless enemies'
      @repeat @mineSwarm()
    )

  introText: ->
    @sequence(
      @wait 2000 # Time for more players to activate
      @if((-> @player(1).active and !@player(2).active)
        @sequence(
          @say 'John', 'I hate that we have bring this ship to the museum!'
          @say 'General', 'Just give her a good last flight John,'
        )
      )
      @if((-> !@player(1).active and @player(2).active)
        @sequence(
          @say 'Jim', 'I don\'t want to bring this ship to the museum!'
          @say 'General', 'Give her a good last flight Jim,'
        )
      )
      @if((-> @player(1).active and @player(2).active)
        @sequence(
          @say 'John', 'I hate that we have bring these ships to the museum!'
          @say 'General', 'Give her a good last flight guys,'
        )
      )
      @say 'General', 'It\'s too bad these ships are too expensive for mass\n' +
        'production and have to be taken out of commission'

      @wait 3000
    )

  tutorial: ->
    @sequence(
      @say('General', 'We send some drones for target practice')
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

  dropRocketForEachPlayer: ->
    @parallel(
      @if((-> @player(1).active and !@player(1).has('rockets')), @drop(item: 'rockets', inFrontOf: @player(1)))
      @if((-> @player(2).active and !@player(2).has('rockets')), @drop(item: 'rockets', inFrontOf: @player(2)))
    )

  droneTakeover: ->
    @sequence(
      @placeSquad Game.Scripts.Splasher,
        amount: 4
        delay: 750
      @say('General', 'What the hell is happening with our drones?')
      @say('General', 'They do not respond to our commands anymore!\nThey have been taken over!')
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
      amount: 8
      delay: 300
      options:
        grid: new Game.LocationGrid
          x:
            start: 200
            steps: 10
            stepSize: 40
          y:
            start: 60
            steps: 8
            stepSize: 40

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
      @dropRocketForEachPlayer()
      @wait 2000
    )

