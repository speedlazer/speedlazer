Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Lunch extends Game.LazerScript
  metadata:
    namespace: 'City'
    speed: 0

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L')

    Game.explosionMode = 'block'

    @sequence(
      @setScenery('Blackness')
      @nextSlide()
      @placeSquad Game.Scripts.Slider,
        options:
          grid: new Game.LocationGrid
            x:
              start: 680
            y:
              start: 250

      @nextSlide()
      @setScenery('OpenSpace')
      @setSpeed 150
      @parallel(
        @placeSquad Game.Scripts.Slider,
          amount: 15
          options:
            grid: new Game.LocationGrid
              x:
                start: 680
                steps: 4
                stepSize: 40
              y:
                start: 100
                steps: 5
                stepSize: 50
        @sequence(
          @waitForScenery 'OpenSpace'
          @setSpeed 0
        )
      )
      @nextSlide()
      @setSpeed 50
      @nextSlide()
      @setSpeed 250
      @nextSlide()
      @setScenery('TunnelStart')
      @waitForScenery 'TunnelStart'
      @setSpeed 50
      @nextSlide()
      @say 'SpeedLazer', 'Hello World!'
      @say 'SpeedLazer', 'Flavor text can add to story telling'
      @waitForScenery 'Tunnel', event: 'inScreen'
      @say 'Enemies', 'Get him!'
      @placeSquad Game.Scripts.Slider,
        amount: 5
        options:
          grid: new Game.LocationGrid
            x:
              start: 680
              steps: 4
              stepSize: 40
            y:
              start: 100
              steps: 5
              stepSize: 50
      @nextSlide()
      @placeSquad Game.Scripts.Sine,
        amount: 5
        delay: 1000
      @setScenery('TunnelEnd')
      @wait 3000
      @placeSquad Game.Scripts.Sine,
        amount: 5
        delay: 1000
      @setSpeed 250
      @waitForScenery 'OceanOld'
      @setSpeed 50
      @nextSlide()
      @gainHeight 200, duration: 5000
      @nextSlide()
      @gainHeight -200, duration: 5000
      @nextSlide()

      @placeSquad Game.Scripts.Swirler,
        amount: 4
        delay: 500
      @placeSquad Game.Scripts.Swirler,
        amount: 4
        delay: 500
      @nextSlide()

      @placeSquad Game.Scripts.LittleDancer,
        amount: 4
        delay: 2000
        options:
          grid: new Game.LocationGrid
            x:
              start: 150
              steps: 4
              stepSize: 100

      @nextSlide()

      @placeSquad Game.Scripts.SplashJumper
      @placeSquad Game.Scripts.Swirler,
        amount: 4
        delay: 500
      @nextSlide()
      => Game.explosionMode = 'particles'
      @placeSquad Game.Scripts.Swirler,
        amount: 4
        delay: 500
      @placeSquad Game.Scripts.Stalker

      # - Talk about Lazerscript

      # -- End of presentation!
      #
      @nextSlide()
      => Game.explosionMode = null
      @loadAssets images: ['water-horizon.png', 'water.png', 'water-front.png']
      @loadAssets images: ['horizon-city.png', 'horizon-city-start.png']
      @loadAssets images: ['city.png']
      @async @runScript(Game.Scripts.SunRise, skipTo: 0, speed: 6)
      @setScenery('Ocean')
      @wait 20000
      @setScenery('CoastStart')
      @swirlAttacks()
      @swirlAttacks()
      @setScenery('BayStart')
      @mineSwarm()
      @mineSwarm()
      @setScenery('UnderBridge')
      @mineSwarm(direction: 'left')
      @placeSquad Game.Scripts.StalkerChain,
        amount: 4
        delay: 500
        options:
          grid: new Game.LocationGrid
            y:
              start: 150
              steps: 4
              stepSize: 80
      @waitForScenery('UnderBridge', event: 'inScreen')
      @setSpeed 0
      @placeSquad Game.Scripts.Stage1BossStage1
    )


  nextSlide: ->
    @sequence(
      @while((=>
        if @player(1).ship()?
          @player(1).ship().superUsed is 0
        else
          true
      ), @wait(1000))
      => @player(1).ship().superUsed = 0
    )

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

