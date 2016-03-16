Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Lunch extends Game.LazerScript
  assets: ->
    @loadAssets('shadow', 'explosion', 'playerShip')

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L')

    Game.explosionMode = 'block'

    @sequence(
      @setScenery('Blackness')
      @hideHud(duration: 0)
      @setWeapons([])
      @enableWeapons()
      @nextSlide()
      @setWeapons(['oldlasers'])
      @nextSlide()
      @updateTitle 'First enemy'
      @showHud()

      @placeSquad Game.Scripts.Slider,
        options:
          grid: new Game.LocationGrid
            x:
              start: 1.1
            y:
              start: .5

      @nextSlide()
      @updateTitle 'More enemies'
      @setScenery('OpenSpace')
      @setSpeed 150
      @parallel(
        @placeSquad Game.Scripts.Slider,
          amount: 15
          options:
            grid: new Game.LocationGrid
              x:
                start: 1.2
                steps: 4
                stepSize: .2
              y:
                start: .2
                steps: 5
                stepSize: .1
        @sequence(
          @waitForScenery 'OpenSpace'
          @setSpeed 0
        )
      )

      @nextSlide()
      @updateTitle 'Level geometry'
      @setSpeed 50

      @nextSlide()
      @updateTitle 'Speed and collision'
      @setSpeed 250

      @nextSlide()
      @updateTitle 'Backgrounds'
      @checkpoint @setScenery 'OpenSpace'
      @setScenery('TunnelStart')
      @waitForScenery 'TunnelStart'
      @setSpeed 50
      @nextSlide()

      @updateTitle 'Dialog'
      @say 'SpeedLazer', 'Hello World!'
      @say 'SpeedLazer', 'Flavor text can add to story telling'
      @nextSlide()
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

      @updateTitle 'Enemy choreo start'
      @nextSlide @sequence(
        @placeSquad Game.Scripts.Sine,
          amount: 5
          delay: 1000
        @wait 3000
      )

      @updateTitle 'Start stage 1'
      @setScenery('TunnelEnd')
      @setSpeed 350

      @waitForScenery 'OceanOld', event: 'inScreen'
      @setSpeed 50
      @checkpoint @setScenery 'OceanOld'
      @nextSlide()
      @updateTitle 'Vertical motion'
      @parallel(
        @gainHeight 600, duration: 15000
        @placeSquad Game.Scripts.Sine,
          amount: 8
          delay: 1000
      )
      @nextSlide()
      @updateTitle 'Bezier, powerups'
      @parallel(
        @gainHeight -600, duration: 15000
        @nextSlide @sequence(
          @placeSquad Game.Scripts.Swirler,
            drop: 'lasers'
            amount: 4
            delay: 500
          @waitForScenery 'OceanOld'
        )
      )

      @nextSlide(
        @sequence(
          @updateTitle 'Lazerscript environment'
          @placeSquad Game.Scripts.Swirler,
            drop: 'lasers'
            amount: 4
            delay: 500
        )
      )
      @checkpoint @setScenery 'OceanOld'
      @updateTitle 'Lazerscript enemies'
      @disableWeapons()

      @placeSquad Game.Scripts.LittleDancer,
        amount: 4
        delay: 2000
        options:
          grid: new Game.LocationGrid
            x:
              start: 150
              steps: 4
              stepSize: 100

      @enableWeapons()

      @nextSlide()
      @updateTitle 'Particle effects'
      => Game.explosionMode = 'particles'

      @checkpoint @setScenery('OceanOld')
      @async @runScript(Game.Scripts.SunRise, skipTo: 0, speed: 4)
      @setScenery('OceanToNew')
      @repeat 3, @sequence(
        @placeSquad Game.Scripts.Swirler,
          drop: 'lasers'
          amount: 4
          delay: 500
        @placeSquad Game.Scripts.Stalker,
          drop: 'lasers'
      )
      @setScenery('CoastStart')
      => Game.explosionMode = null
      @updateTitle 'Graphics!'
      @swirlAttacks()
      @swirlAttacks()
      @setScenery('BayStart')
      @mineSwarm()
      @mineSwarm(direction: 'left')
      @placeSquad Game.Scripts.Stage1BossStage1
      @gainHeight 200, duration: 5000
      @showScore(1, 'Lunch and learn')
      @repeat @sequence(
        @placeSquad Game.Scripts.Stage1BossPopup
        @wait 2000
      )
    )


  nextSlide: (task) ->
    @sequence(
      => @player(1).ship()?.superUsed = 0
      # While now works with 2 promises.
      @while(
        @_waitForSuperWeapon()
        task ? @wait(1000)
      )
      => @player(1).ship().superUsed = 0
    )

  _waitForSuperWeapon: ->
    =>
      d = WhenJS.defer()
      used = no
      i = setInterval(
        =>
          if @player(1).ship()?
            used = @player(1).ship().superUsed isnt 0
          if used
            clearInterval i
            d.resolve()
        300
      )
      d.promise

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

