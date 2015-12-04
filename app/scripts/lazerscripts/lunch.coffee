Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Lunch extends Game.LazerScript
  metadata:
    namespace: 'City'
    speed: 0
    armedPlayers: 'oldlasers'

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L')

    Game.explosionMode = 'block'

    @sequence(
      @loadAssets(
        images: ['water-horizon.png', 'water.png', 'water-front.png']
        sprites:
          'mine.png':
            tile: 25
            tileh: 25
            map:
              standardMine: [0,0]
            paddingX: 1
          'sun.png':
            tile: 1
            tileh: 1
            map:
              sun: [0,0,35,35]
              directGlare: [0,81,175,175]
              redGlare: [0,36,10,10]
              blueGlare: [120, 0, 80, 80]
              bigGlare: [0, 256, 200, 200]
      )
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
      @checkpoint @setScenery 'OpenSpace'
      @setScenery('TunnelStart')
      @waitForScenery 'TunnelStart'
      @setSpeed 50
      @nextSlide()
      @say 'SpeedLazer', 'Hello World!'
      @say 'SpeedLazer', 'Flavor text can add to story telling'
      @waitForScenery 'Tunnel', event: 'inScreen'
      @say 'Enemies', 'Get him!'

      @nextSlide @sequence(
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
        @wait 3000
      )
      @nextSlide @sequence(
        @placeSquad Game.Scripts.Sine,
          amount: 5
          delay: 1000
        @wait 3000
      )
      @setScenery('TunnelEnd')
      @setSpeed 350

      @waitForScenery 'TunnelEnd', event: 'inScreen'
      @setSpeed 50
      @checkpoint @setScenery 'OceanOld'
      @nextSlide()
      @parallel(
        @gainHeight 200, duration: 5000
        @placeSquad Game.Scripts.Sine,
          amount: 5
          delay: 1000
      )
      @nextSlide()
      @gainHeight -200, duration: 5000
      @nextSlide(
        @placeSquad Game.Scripts.Swirler,
          drop: 'lasers'
          amount: 4
          delay: 500
      )
      @checkpoint @setScenery 'OceanOld'

      @placeSquad Game.Scripts.SplashJumper,
        drop: 'lasers'

      @placeSquad Game.Scripts.Swirler,
        drop: 'lasers'
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
      => Game.explosionMode = 'particles'

      @loadAssets images: ['horizon-city.png', 'horizon-city-start.png']
      @loadAssets images: ['city.png']
      @loadAssets images: ['city.png', 'city-layer2.png']
      @checkpoint @setScenery('OceanOld')
      @async @runScript(Game.Scripts.SunRise, skipTo: 0, speed: 6)
      @setScenery('OceanToNew')
      @placeSquad Game.Scripts.Swirler,
        drop: 'lasers'
        amount: 4
        delay: 500
      @placeSquad Game.Scripts.Stalker,
        drop: 'lasers'
      @wait 20000
      @setScenery('CoastStart')
      => Game.explosionMode = null
      @swirlAttacks()
      @swirlAttacks()
      @setScenery('BayStart')
      @mineSwarm()
      @mineSwarm(direction: 'left')
      @placeSquad Game.Scripts.Stage1BossStage1
    )


  nextSlide: (task) ->
    @sequence(
      => @player(1).ship()?.superUsed = 0
      @while((=>
        if @player(1).ship()?
          @player(1).ship().superUsed is 0
        else
          true
      ), task ? @wait(1000))
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

