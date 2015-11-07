Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1 extends Game.LazerScript
  metadata:
    namespace: 'City'
    #startScenery: 'UnderBridge'
    #startScenery: 'Ocean'
    startScenery: 'Intro'
    #armedPlayers: no
    speed: 50

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L')

    @sequence(
      @async @sunRise()
      @introText()
      @tutorial()
      @droneTakeover()
      @parallel(
        @sequence(
          @wait 2000
          @say 'General', 'Forget that museum. We\'re under attack!'
        )
        @swirlAttacks()
      )

      @setScenery('CoastStart')
      @swirlAttacks()
      @underWaterAttacks()
      @mineSwarm()

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
      @setScenery('UnderBridge')
      @mineSwarm()
      @setSpeed 25
      @mineSwarm direction: 'left'
      @mineSwarm()

      @waitForScenery('UnderBridge', event: 'inScreen')
      @setSpeed 0
      @bossFightStage1()
      @say('General', 'Hunt him down!')

      @gainHeight(300, duration: 4000)

      @setScenery('Skyline')

      #@waitForScenery('Skyline', event: 'leave')
      @disableWeapons()
      @showScore(1, 'City')
      @enableWeapons()
    )

  introText: ->
    @sequence(
      @wait 2000 # Time for more players to activate
      @if((-> @player(1).active and @player(2).active)
        @say 'John', 'Too bad we have to bring these ships to the museum!'
      # else
        @say 'John', 'Too bad we have to bring this ship to the museum!'
      )
      @if((-> @player(1).active and !@player(2).active)
        @say 'General', 'Just give her a good last flight John,'
      )
      @if((-> !@player(1).active and @player(2).active)
        @say 'General', 'Give her a good last flight Jim,'
      )
      @if((-> @player(1).active and @player(2).active)
        @say 'General', 'Give her a good last flight guys,'
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

  sunRise: ->
    @runScript(Game.Scripts.SunRise)

  mineSwarm: (options = { direction: 'right' })->
    @placeSquad Game.Scripts.JumpMine,
      amount: 8
      delay: 300
      options:
        x: -> (Math.round(Math.random() * 10) * 40) + 200
        y: -> (Math.round(Math.random() * 8) * 40) + 60
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

  bossFightStage1: ->
    @placeSquad Game.Scripts.Stage1BossStage1
