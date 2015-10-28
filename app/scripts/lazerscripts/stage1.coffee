
Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1 extends Game.LazerScript
  metadata:
    namespace: 'City'
    startScenery: 'Intro'

  execute: ->
    #@inventoryAdd 'enemy', 'default', ->
      #Crafty.e('Drone').drone(health: 200)
    @inventoryAdd 'enemy', 'weaponizedDrone', ->
      Crafty.e('Drone,Weaponized').drone(health: 200)
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L')

    @sequence(
      @introText()
      @tutorial()
      @droneTakeover()
      #@swirlAttacks()
      #@setScenery('CoastStart')
      #@underWaterAttacks()
      #@setScenery('Bay')

      #@wait(20000)
      #@setScenery('UnderBridge')
      #@waitForScenery('UnderBridge', event: 'leave')
      #@setScenery('UnderBridge')
      #@waitForScenery('UnderBridge', event: 'leave')
      #@gainHeight(250, duration: 4000)
      #@setScenery('Skyline')
      #@waitForScenery('Skyline', event: 'leave')
      #@disableWeapons()
      #@showScore()
      #@enableWeapons()
    )

  introText: ->
    @sequence(
      @wait 2000 # Time for more players to activate
      @if((-> @player(1).active and @player(2).active)
        @say 'John', 'Too bad we have to bring these ships to the museum!'
      # else
        @say 'John', 'Too bad we have to bring this ship to the museum!'
      )
      @say 'General', 'Just give her a good last flight,\nwe document some moves on the way!'
      @wait 10000 # Maybe more/better script text here?
    )

  tutorial: ->
    @sequence(
      @say('General', 'Evade the upcoming drones!')
      @placeSquad Game.Scripts.Swirler,
        amount: 4
        delay: 500
      #@wave('FlyOver')
      @say('General', 'We dropped an upgrade to show the weapon systems')
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
    #@inventoryAdd 'enemy', 'backgroundDrone', ->
      #Crafty.e('BackgroundDrone').drone()

    @sequence(
      #@wave('Splash', enemy: 'backgroundDrone')
      @say('General', 'Wtf is happening with our drones?')
      #@wave('FlyOver', enemy: 'weaponizedDrone', drop: 'lasers')
      @say('General', 'Their AI has been compromised by our rogue prototype!\nEliminate it!')
      @if((-> @player(1).active)
        @say 'John', 'How?'
      )
      @if((-> !@player(1).active and @player(2).active)
        @say 'Jack', 'What the...'
      )
      @say 'General', 'It\'s hiding in the city! go!'
    )

  #swirlAttacks: ->
    #@sequence(
      #@wave('SwirlAttack', drop: 'lasers')
      #@wave('SwirlAttack2', drop: 'lasers')

      #@repeat(2,
        #@parallel(
          #@wave('SwirlAttack2', drop: 'lasers')
          #@sequence(
            #@wait(3000)
            #@wave('SwirlAttack', drop: 'lasers')
          #)
          #@sequence(
            #@wait(6000)
            #@wave('SwirlAttack2', drop: 'lasers')
          #)
          #@sequence(
            #@wait(9000)
            #@wave('SwirlAttack', drop: 'lasers')
          #)
        #)
      #)
    #)

  #underWaterAttacks: ->
    #@repeat(3, @wave('UnderWater'))
