Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1 extends Game.LazerScript
  metadata:
    namespace: 'City'
    armedPlayers: 'lasers'
    speed: 50
    title: 'City'

  assets: ->
    @loadAssets('general',
      sprites:
        'general.png':
          tile: 1
          tileh: 1
          map:
            shadow: [1, 18, 35, 20]
            standardRocket: [1, 1, 45, 15]
    )

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L').color('#2020FF')
    @inventoryAdd 'item', 'xp', ->
      Crafty.e('PowerUp').powerUp(contains: 'xp', marking: 'X')
    @inventoryAdd 'item', 'diagonals', ->
      Crafty.e('PowerUp').powerUp(contains: 'diagonals', marking: 'D').color('#8080FF')

    @sequence(
      @introText()
      @tutorial()
      @droneTakeover()
      @oceanFighting()
      @enteringLand()
      @cityBay()
      @midstageBossfight()

      @checkpoint @checkpointMidStage('Bay', 355000)
      @say('General', 'Hunt him down!')
      @setSpeed 100
      @placeSquad Game.Scripts.Shooter,
        amount: 4
        delay: 1000
        drop: 'xp'
        options:
          shootOnSight: yes

      @repeat 3, @stalkerShootout()

      @parallel(
        @sequence(
          @wait 3000
          @gainHeight(300, duration: 4000)
          @placeSquad Game.Scripts.Shooter,
            amount: 4
            delay: 1000
            drop: 'xp'
            options:
              shootOnSight: yes
        )
        @placeSquad Game.Scripts.Stage1BossPopup
      )

      @cityFighting()

      @repeat 2, @dummyFights()
      @gainHeight(280, duration: 4000)

      @checkpoint @checkpointMidStage('Skyline', 400000)
      @dummyFights()
      @setScenery 'SkylineBase'
      @while(
        @wait 4000
        @sequence(
          @pickTarget('PlayerControlledShip')
          @placeSquad Game.Scripts.Stage1BossRocket,
            options:
              location: @targetLocation(x: 1.1)
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
      @changeSeaLevel 500
      @gainHeight(-580, duration: 6000)
      #@say 'DesignNote', 'Add some enemies and setting here!'
      #@wait 3000
      #@gainHeight(-580, duration: 6000)

      #@gainHeight(-580, duration: 4000)


      @say 'Game', 'End of gameplay for now... \nStarting endless enemies'
      @repeat @mineSwarm(points: no)
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
          drop: 'xp'
      ))
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
    @parallel(
      @placeSquad Game.Scripts.CrewShooters,
        amount: 4
        delay: 750
        drop: 'xp'
      @sequence(
        @say('General', 'What the hell is happening with our drones?')
        @say('General', 'They do not respond to our commands anymore!\nThe defence AI has been compromised!')
      )
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
      @checkpoint @checkpointStart('Bay', 226000)
      @setScenery('UnderBridge')
      @parallel(
        @if((-> @player(1).active), @drop(item: 'xp', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'xp', inFrontOf: @player(2)))
      )
      @mineSwarm()
      @parallel(
        @if((-> @player(1).active), @drop(item: 'xp', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'xp', inFrontOf: @player(2)))
      )
      @mineSwarm direction: 'left'
      @parallel(
        @if((-> @player(1).active), @drop(item: 'xp', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'xp', inFrontOf: @player(2)))
      )
      @mineSwarm()
      @while(
        @waitForScenery('UnderBridge', event: 'inScreen')
        @sequence(
          @pickTarget('PlayerControlledShip')
          @placeSquad Game.Scripts.Stage1BossRocket,
            options:
              location: @targetLocation(x: 1.1)
          @wait 200
        )
      )
      @setSpeed 0
      @placeSquad Game.Scripts.Stage1BossStage1

      @setSpeed 50
    )

  swirlAttacks: ->
    @parallel(
      @repeat 2, @placeSquad Game.Scripts.Swirler,
        amount: 4
        delay: 500
        drop: 'xp'
        options:
          shootOnSight: yes
      @repeat 2, @placeSquad Game.Scripts.Shooter,
        amount: 4
        delay: 500
        drop: 'xp'
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
        points: options.points ? yes
        direction: options.direction

  stalkerShootout: ->
    @parallel(
      @placeSquad Game.Scripts.Stalker
      @placeSquad Game.Scripts.Shooter,
        amount: 4
        delay: 1000
        drop: 'xp'
        options:
          shootOnSight: yes
      @placeSquad Game.Scripts.Swirler,
        amount: 4
        delay: 1000
        drop: 'xp'
        options:
          shootOnSight: yes
    )

  cityFighting: ->
    @sequence(
      @setScenery('Skyline')
      @parallel(
        @sequence(
          @placeSquad Game.Scripts.ScraperFlyer,
            amount: 8
            delay: 750
            drop: 'xp'
          @placeSquad Game.Scripts.Stage1BossPopup
        )
        @sequence(
          @wait 3000
          @placeSquad Game.Scripts.Swirler,
            amount: 8
            delay: 750
            drop: 'xp'
            options:
              shootOnSight: yes
        )
      )
    )

  dummyFights: ->
    @while(
      @parallel(
        @placeSquad Game.Scripts.ScraperFlyer,
          amount: 8
          delay: 750
          drop: 'xp'
        @placeSquad Game.Scripts.Swirler,
          amount: 8
          delay: 500
          drop: 'xp'
          options:
            shootOnSight: yes
            speed: 300
        @placeSquad Game.Scripts.Shooter,
          amount: 8
          delay: 1000
          drop: 'xp'
          options:
            shootOnSight: yes
            speed: 300
      )
      @sequence(
        @pickTarget('PlayerControlledShip')
        @placeSquad Game.Scripts.Stage1BossRocket,
          options:
            location: @targetLocation(x: 1.1)
        @wait 500
      )
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
      @wait 1000
      @dropDiagonalsForEachPlayer()
      @wait 1000
    )

