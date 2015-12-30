Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1Boss extends Game.EntityScript
  assets: ->
    @loadAssets(
      sprites:
        'large-drone.png':
          tile: 90
          tileh: 70
          map:
            standardLargeDrone: [0,0]
            damage1LargeDrone: [1,0]
            damage2LargeDrone: [2,0]
            damage3LargeDrone: [3,0]
          paddingX: 1
        'large-drone-wing.png':
          tile: 46
          tileh: 21
          map:
            wingLoaded: [3,0]
          paddingX: 1
          paddingY: 1
        'large-drone-eye.png':
          tile: 20
          tileh: 26
          map:
            eyeStart: [0,0]
          paddingX: 1
          paddingY: 1
    )

class Game.Scripts.Stage1BossStage1 extends Game.Scripts.Stage1Boss

  spawn: ->
    Crafty.e('LargeDrone').drone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .83
      speed: 100
    )

  execute: ->
    @bindSequence 'Hit', @fase2, => @entity.health < 150000

    @sequence(
      @animate 'slow', -1, 'eye'
      @disableWeapons()
      @moveTo(x: .85, y: .41)
      @say('Large Drone', 'We have control now! You will suffer!')
      @say('Large Drone', 'Earths defences are in our hands!')
      @wait 500
      @enableWeapons()
      @moveTo(y: .43, speed: 5)
      @attackCycle()
    )

  attackCycle: ->
    @repeat @sequence(
      @async @runScript(Game.Scripts.Stage1BossMine, @location())
      @moveTo(y: .41, speed: 5)
      @wait 200
      @async @runScript(Game.Scripts.Stage1BossRocket, @location())
      @animate 'emptyWing', 0, 'wing'
      @animate 'reload', 0, 'wing'
      @async @runScript(Game.Scripts.Stage1BossMine, @location())
      @moveTo(y: .43, speed: 5)
      @async @runScript(Game.Scripts.Stage1BossRocket, @location())
      @animate 'emptyWing', 0, 'wing'
      @wait 200
      @animate 'reload', 0, 'wing'
    )

  fase2: ->
    @bindSequence 'Hit', @fase3, => @entity.health < 135000

    @sequence(
      @setSpeed 50
      @attackCycle()
    )

  fase3: ->
    @sequence(
      @drop(location: @location(), item: 'lasers')
      @moveTo(x: 1.15, y: .21, speed: 100)
    )

class Game.Scripts.Stage1BossMine extends Game.EntityScript
  assets: ->
    @loadAssets(
      sprites:
        'mine.png':
          tile: 25
          tileh: 25
          map:
            standardMine: [0,0]
          paddingX: 1
    )

  spawn: (location) ->
    Crafty.e('Mine').mine(
      health: 200
      x: location().x
      y: location().y + 70
      speed: 200
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @pickTarget('PlayerControlledShip')
      @moveTo(y: 1.1)
      @moveTo(@targetLocation(), y: 1.01)
      @moveTo(@targetLocation(x: null))
      @animate 'open'
      @wait 200
      @animate 'blink', -1
      @wait 1000
      @explosion(@location(), damage: yes, radius: 40)
    )

  onKilled: ->
    @explosion(@location(), damage: 200, radius: 40)


class Game.Scripts.Stage1BossRocket extends Game.EntityScript
  assets: ->
    @loadAssets(
      sprites:
        'rocket.png':
          tile: 45
          tileh: 15
          map:
            standardRocket: [0,0]
          paddingX: 1
    )

  spawn: (location) ->
    Crafty.e('Rocket').rocket(
      health: 250
      x: location().x - 30
      y: location().y - 5 + Math.round(Math.random() * 10)
      speed: 600
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled

    @moveTo(x: -205)

  onKilled: ->
    @explosion(@location(), damage: 200, radius: 40)


class Game.Scripts.Stage1BossPopup extends Game.Scripts.Stage1Boss
  spawn: ->
    Crafty.e('LargeDrone').drone(
      health: 134000
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .83
      speed: 100
    )

  execute: ->
    @bindSequence 'Hit', @leaveScreen, => @entity.health < 133000

    @sequence(
      @animate 'slow', -1, 'eye'
      @pickTarget('PlayerControlledShip')
      @moveTo(@targetLocation(), x: .845)
      @attackCycle()
    )

  leaveScreen: ->
    @sequence(
      @drop(location: @location(), item: 'lasers')
      @moveTo(x: 1.15, speed: 100)
    )

  attackCycle: ->
    @repeat @sequence(
      @async @runScript(Game.Scripts.Stage1BossRocket, @location())
      @animate 'emptyWing', 0, 'wing'
      @parallel(
        @moveTo(@targetLocation(offsetY: -20), x: .845)
        @sequence(
          @animate 'reload', 0, 'wing'
          @wait 1000
        )
      )
    )

