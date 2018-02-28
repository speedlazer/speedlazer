defaults = require('lodash/defaults')
PresentationLeaveScreen = require('./lunch/presentation_leave_screen').default
LittleDancer = require('./lunch/little_dancer').default
LunchBossStage1 = require('./lunch/lunch_boss').default
PresentationShooter = require('./lunch/presentation_shooter').default
PresentationSunRise = require('./lunch/presentation_sunrise').default
PresentationSunSet = require('./lunch/presentation_sunset').default
PresentationSwirler = require('./lunch/presentation_swirler').default
JumpMine = require('./stage1/jump_mine').default
Sine = require('./lunch/sine').default
Slider = require('./lunch/slider').default
SunRise = require('./stage1/sunrise').default
{ LazerScript } = require('src/lib/LazerScript')
{ Swirler, Shooter } = require('./stage1/army_drone')

class Lunch extends LazerScript
  assets: ->
    @loadAssets('explosion', 'playerShip')

  execute: ->
    @inventoryAdd 'weapon', 'oldlasers', marking: 'L'
    @inventoryAdd 'weapon', 'lasers', marking: 'L'
    @inventoryAdd 'ship', 'points', marking: 'P', icon: 'star'
    @inventoryAdd 'ship', 'xp', marking: 'XP', icon: 'star'
    Game.explosionMode = 'block'

    @sequence(
      => Crafty.audio.mute()
      @setShipType('PlayerControlledCube')
      @setScenery('City.Blackness')
      @hideHud(duration: 0)
      @setWeapons([])
      @enableWeapons()
      @nextSlide()
      @setWeapons(['oldlasers'])
      @nextSlide()
      @updateTitle 'First enemy'
      @placeSquad Slider,
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
      @setScenery('City.OpenSpace')
      @setSpeed 150, accellerate: no
      @parallel(
        @placeSquad Slider,
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
      @checkpoint @setScenery 'City.OpenSpace'
      @setScenery('City.TunnelStart')
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
          @placeSquad Slider,
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
        @placeSquad Sine,
          amount: 5
          delay: 1000
        @wait 3000
      )

      @updateTitle 'Start stage 1'
      @setScenery('City.TunnelEnd')
      @setSpeed 450, accellerate: no

      @waitForScenery 'OceanOld', event: 'leave'
      @setSpeed 50, accellerate: no
      @checkpoint @setScenery 'City.OceanOld'
      @nextSlide()
      @updateTitle 'Bezier, powerups'
      @nextSlide @sequence(
        @placeSquad PresentationSwirler,
          drop: 'xp'
          amount: 4
          delay: 500
        @waitForScenery 'OceanOld'
      )

      @updateTitle 'Lazerscript environment'
      @nextSlide(
        @placeSquad PresentationSwirler,
          drop: 'xp'
          amount: 3
          delay: 500
      )
      @nextSlide(
        @parallel(
          @placeSquad PresentationShooter,
            drop: 'xp'
            amount: 3
            delay: 600
          @placeSquad PresentationSwirler,
            amount: 3
            delay: 500
        )
      )
      @checkpoint @setScenery 'City.OceanOld'
      @updateTitle 'Lazerscript enemies'
      @disableWeapons()

      @placeSquad LittleDancer,
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

      @checkpoint @setScenery('City.OceanOld')
      @setScenery('City.OceanToNew')
      @async @runScript(PresentationSunRise, skipTo: 0, speed: 10)
      @repeat 4, @sequence(
        @placeSquad PresentationSwirler,
          drop: 'xp'
          amount: 6
          delay: 700
      )
      => Game.explosionMode = null
      @updateTitle 'Graphics!'
      @swirlAttacks()
      @swirlAttacks()
      @setScenery('City.CoastStart')

      @nextSlide @sequence(
        @mineSwarm(juice: no)
      )
      @checkpoint @sunriseCheckpoint(PresentationSunRise, 90000, 10, 'City.CoastStart')
      @parallel(
        @runScript(PresentationSunSet, skipTo: 0, speed: 50)
        @sequence(
          @say 'Graphics', 'Ok lets do the sunrise again'
          @say 'Graphics', 'And now use WebGL Shaders'
        )
      )

      @say 'WebGL', 'Ready?'
      @say 'WebGL', 'Really ready?'
      =>
        Game.webGLMode = on
        Crafty('GoldenStripe').each -> @bottomColor('#DDDD00', 0)
        Crafty('waterMiddle').each -> @attr lightness: 1.0
        Crafty('waterHorizon').each -> @attr lightness: 1.0
      @chapterTitle(1, 'WebGL Shaders')
      @async @runScript(SunRise, skipTo: 0, speed: 2)
      @setScenery('City.BayStart')
      @nextSlide @sequence(
        @swirlAttacks2()
      )
      @disableWeapons(1)
      @say 'Player 1', 'Help I have a weapon malfunction!!'
      @say 'Player 2', 'No worries, I will fight for you!'
      @chapterTitle(2, 'Juice')
      @nextSlide @sequence(
        @swirlAttacks2()
      )
      @setWeapons(['lasers'])
      @say 'Player 2', 'Woohoo Autofire! I will save you buddy!'
      @setSpeed 100, accellerate: yes
      @swirlAttacks2(juice: yes)
      @enableWeapons()
      @say 'Player 1', 'My weapon works again! I seemed I was pressing the\n' +
        'wrong button all this time!'
      @say 'Player 2', 'Sigh...'
      @setSpeed 150, accellerate: yes
      @nextSlide(
        @mineSwarm(juice: yes)
      )
      @chapterTitle(3, 'Minimal viable audio')
      @wait 1000
      => Crafty.audio.unmute()
      @nextSlide(
        @mineSwarm(juice: yes)
      )
      @nextSlide(
        @placeSquad Swirler,
          amount: 4
          delay: 500
          drop: 'xp'
          options:
            juice: yes
      )
      @checkpoint @sunriseCheckpoint(SunRise, 120000, 2, 'City.Bay')
      @setScenery 'City.UnderBridge'
      @updateTitle 'Player ship'
      @setWeapons(['lasers'])
      @setShipType('PlayerSpaceship')
      @setWeapons(['lasers'])
      @while(
        @waitForScenery('UnderBridge', event: 'enter')
        @placeSquad Swirler,
          amount: 4
          delay: 500
          drop: 'xp'
          options:
            juice: yes
      )
      @setSpeed 50, accellerate: yes
      @waitForScenery('UnderBridge', event: 'inScreen')
      @checkpoint @sunriseCheckpoint(SunRise, 140000, 2, 'City.UnderBridge')
      @setSpeed 0
      @nextSlide()
      @chapterTitle(4, 'Bossfight!')
      @placeSquad LunchBossStage1
      @checkpoint @parallel(
        @async @runScript(SunRise, skipTo: 450000, speed: 2)
        @setScenery 'City.Skyline'
        @gainHeight(600, duration: 0)
        @setSpeed 150
      )
      @wait 5000
      @parallel(
        @sequence(
          @disableControls()
          @disableWeapons()
          @placeSquad(PresentationLeaveScreen,
            amount: 2
            delay: 1000
          )
        )
        @sequence(
          @say 'With the evil boss destroyed\nMankind was saved again!'
          @say 'And our heroes where off to another adventure!'
          @say 'Thanks for playing!'
        )
      )
      @screenFadeOut()
      @endGame()
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
    options = defaults(options,
      direction: 'right'
      juice: yes
    )

    @placeSquad JumpMine,
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
      @repeat 2, @placeSquad PresentationSwirler,
        amount: 4
        delay: 500
        drop: 'xp'
      @repeat 2, @placeSquad PresentationShooter,
        amount: 4
        delay: 500
        drop: 'xp'
    )

  swirlAttacks2: (options = { juice: no }) ->
    @parallel(
      @repeat 2, @placeSquad Swirler,
        amount: 4
        delay: 500
        drop: 'xp'
        options: options
      @repeat 2, @placeSquad Shooter,
        amount: 4
        delay: 500
        drop: 'xp'
        options: options
    )

  sunriseCheckpoint: (script, skip, speed, scenery) ->
    @sequence(
      @async @runScript(script, skipTo: skip, speed: speed)
      @setScenery(scenery)
      @wait 2000
    )

module.exports =
  default: Lunch
