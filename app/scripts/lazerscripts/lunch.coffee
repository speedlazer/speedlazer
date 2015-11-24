Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Lunch extends Game.LazerScript
  metadata:
    namespace: 'City'
    speed: 0

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L')

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
      @setScenery('OceanOld')
      @waitForScenery 'OceanOld'
      @setSpeed 50
      # - Old perspective tunnel
      # - Old ocean at end of tunnel
      @nextSlide()
      #@gainHeight 200, duration: 10000
      #@nextSlide()
      #@gainHeight -200, duration: 10000
      #@nextSlide()
      # - Dialog
      # - Old enemies again
      # - New choreochraphy enemies (swirl)
      #   Delay
      #   Enemies again
      # - Talk about Lazerscript
      #   Swirling enemies
      #   Enemies from underwater
      # - Enemy that bounces in and out of water
      # - Old particles
      # - Set graphical scenery on
      @loadAssets images: ['water-horizon.png', 'water.png', 'water-front.png']
      @async @runScript(Game.Scripts.SunRise, skipTo: 0, speed: 6)
      @setScenery('Ocean')
      @wait 20000
      @setScenery('CoastStart')
      @swirlAttacks()
      @setScenery('Bay')
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

