Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Lunch extends Game.LazerScript
  assets: ->
    @loadAssets('shadow', 'explosion', 'playerShip')

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L')
    @inventoryAdd 'item', 'xp', ->
      Crafty.e('PowerUp').powerUp(contains: 'xp', marking: 'X')

    Game.explosionMode = 'block'

    @sequence(
      => Crafty.audio.mute()
      @setShipType('PlayerControlledCube')
      @setScenery('Blackness')
      @hideHud(duration: 0)
      @setWeapons([])
      @enableWeapons()
      @nextSlide()
      @setWeapons(['oldlasers'])
      @nextSlide()
      @updateTitle 'First enemy'

      @placeSquad Game.Scripts.Slider,
        options:
          gridConfig:
            x:
              start: 1.1
            y:
              start: .5
      @showHud()
      @updateTitle '2 Players'

      @nextSlide()
      @updateTitle 'More enemies'
      @setScenery('OpenSpace')
      @setSpeed 150, accellerate: no
      @parallel(
        @placeSquad Game.Scripts.Slider,
          amount: 15
          options:
            gridConfig:
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
          @setSpeed 0, accellerate: no
        )
      )

      @nextSlide()
      @updateTitle 'Level geometry'
      @setSpeed 50, accellerate: no

      @nextSlide()
      @updateTitle 'Speed and collision'
      @setSpeed 250, accellerate: no

      @nextSlide()
      @updateTitle 'Backgrounds'
      @checkpoint @setScenery 'OpenSpace'
      @setScenery('TunnelStart')
      @waitForScenery 'TunnelStart'
      @setSpeed 50, accellerate: no
      @nextSlide()

      @updateTitle 'Dialog'
      @say 'SpeedLazer', 'Hello World!'
      @say 'SpeedLazer', 'Flavor text can add to story telling'
      @nextSlide()
      @parallel(
        @sequence(
          @wait 3000
          @say 'Enemies', 'Get them!'
        )
        @nextSlide @sequence(
          @placeSquad Game.Scripts.Slider,
            amount: 5
            options:
              gridConfig:
                x:
                  start: 1.2
                  steps: 4
                  stepSize: .2
                y:
                  start: .3
                  steps: 5
                  stepSize: .1
          @wait 3000
        )
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
      @setSpeed 450, accellerate: no

      @waitForScenery 'OceanOld', event: 'leave'
      @setSpeed 50, accellerate: no
      @checkpoint @setScenery 'OceanOld'
      @nextSlide()
      @updateTitle 'Bezier, powerups'
      @nextSlide @sequence(
        @placeSquad Game.Scripts.PresentationSwirler,
          drop: 'xp'
          amount: 4
          delay: 500
        @waitForScenery 'OceanOld'
      )

      @updateTitle 'Lazerscript environment'
      @nextSlide(
        @placeSquad Game.Scripts.PresentationSwirler,
          drop: 'xp'
          amount: 3
          delay: 500
      )
      @nextSlide(
        @parallel(
          @placeSquad Game.Scripts.PresentationShooter,
            drop: 'xp'
            amount: 3
            delay: 600
          @placeSquad Game.Scripts.PresentationSwirler,
            amount: 3
            delay: 500
        )
      )
      @checkpoint @setScenery 'OceanOld'
      @updateTitle 'Lazerscript enemies'
      @disableWeapons()

      @placeSquad Game.Scripts.LittleDancer,
        amount: 5
        delay: 2000
        options:
          gridConfig:
            x:
              start: .25
              steps: 5
              stepSize: .1

      @enableWeapons()

      @updateTitle 'Particle effects'
      => Game.explosionMode = 'particles'
      => Game.webGLMode = off

      @checkpoint @setScenery('OceanOld')
      @setScenery('OceanToNew')
      @async @runScript(Game.Scripts.PresentationSunRise, skipTo: 0, speed: 10)
      @repeat 4, @sequence(
        @placeSquad Game.Scripts.PresentationSwirler,
          drop: 'xp'
          amount: 6
          delay: 700
      )
      => Game.explosionMode = null
      @updateTitle 'Graphics!'
      @swirlAttacks()
      @swirlAttacks()
      @setScenery('CoastStart')

      @nextSlide @sequence(
        @mineSwarm(juice: no)
      )
      @setScenery('BayStart')
      @async @runScript(Game.Scripts.PresentationSunSet, skipTo: 0, speed: 50)
      @say 'Graphics', 'Ok lets do the sunrise again'
      @say 'Graphics', 'And now use WebGL Shaders'

      @checkpoint @setScenery('BayStart')
      @nextSlide @sequence(
        @swirlAttacks2()
      )
      =>
        Game.webGLMode = on
        Crafty('GoldenStripe').each -> @bottomColor('#DDDD00', 0)
        Crafty('waterMiddle').each -> @attr lightness: 1.0
        Crafty('waterHorizon').each -> @attr lightness: 1.0
      @chapterTitle(1, 'WebGL Shaders')

      @async @runScript(Game.Scripts.SunRise, skipTo: 0, speed: 5)
      @nextSlide()
      @updateTitle 'Juice'
      @disableWeapons()
      @nextSlide(
        @mineSwarm(juice: no)
      )
      @setSpeed 100, accellerate: yes
      @nextSlide(
        @mineSwarm(juice: yes)
      )
      @enableWeapons()
      @chapterTitle(2, 'Minimal viable audio')
      @wait 1000
      @setWeapons(['lasers'])
      => Crafty.audio.unmute()
      @nextSlide(
        @mineSwarm(juice: yes)
      )
      @nextSlide(
        @placeSquad Game.Scripts.Swirler,
          amount: 4
          delay: 500
          options:
            juice: yes
      )
      @checkpoint @setScenery 'Bay'
      @setScenery 'UnderBridge'
      @updateTitle 'Player ship'
      @setWeapons(['lasers'])
      @setShipType('PlayerSpaceship')
      @setWeapons(['lasers'])
      @while(
        @waitForScenery('UnderBridge', event: 'enter')
        @placeSquad Game.Scripts.Swirler,
          amount: 4
          delay: 500
          options:
            juice: yes
      )
      @waitForScenery('UnderBridge', event: 'inScreen')
      @setSpeed 0
      @placeSquad Game.Scripts.LunchBossStage1

      @gainHeight 200, duration: 5000
      @repeat @sequence(
        @placeSquad Game.Scripts.Stage1BossPopup
        @wait 2000
      )
    )


  nextSlide: (task) ->
    @sequence(
      # While now works with 2 promises.
      @while(
        @_waitForKeyPress(Crafty.keys.N)
        @sequence(
          task ? @wait(1000)
          @_addVisibleMarker()
        )
      )
    )

  _addVisibleMarker: ->
    =>
      text = ''
      Crafty('LevelTitle').each ->
        text = @_text
      if text[text.length - 1] is '-'
        text = text.slice(0, text.length - 2)
      unless text[text.length - 1] is '*'
        Crafty('LevelTitle').text text + ' *'

  _clearVisibleMarker: ->
    text = ''
    Crafty('LevelTitle').each ->
      text = @_text
    if text[text.length - 1] is '*'
      Crafty('LevelTitle').text(text.slice(0, text.length - 2) + ' -')

  _waitForKeyPress: (key) ->
    =>
      d = WhenJS.defer()
      handler = (e) =>
        if e.key == key
          @_clearVisibleMarker()
          Crafty.unbind('KeyDown', handler)
          d.resolve()

      Crafty.bind('KeyDown', handler)
      d.promise

  mineSwarm: (options = {}) ->
    options = _.defaults(options,
      direction: 'right'
      juice: yes
    )

    @placeSquad Game.Scripts.JumpMine,
      amount: 8
      delay: 300
      options:
        juice: options.juice
        gridConfig:
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
      @repeat 2, @placeSquad Game.Scripts.PresentationSwirler,
        amount: 4
        delay: 500
        drop: 'xp'
      @repeat 2, @placeSquad Game.Scripts.PresentationShooter,
        amount: 4
        delay: 500
        drop: 'xp'
    )

  swirlAttacks2: ->
    @parallel(
      @repeat 2, @placeSquad Game.Scripts.Swirler,
        amount: 4
        delay: 500
        drop: 'xp'
        options:
          #shootOnSight: yes
          juice: no
      @repeat 2, @placeSquad Game.Scripts.Shooter,
        amount: 4
        delay: 500
        drop: 'xp'
        options:
          #shootOnSight: yes
          juice: no
    )

