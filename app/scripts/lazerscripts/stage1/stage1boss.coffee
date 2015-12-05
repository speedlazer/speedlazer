Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1BossStage1 extends Game.EntityScript

  spawn: ->
    Crafty.e('LargeDrone').drone(
      health: 160000
      x: 680
      y: 400
      speed: 100
    )

  execute: ->
    @bindSequence 'Hit', @fase2, => @entity.health < 140000
    @inventoryAdd 'item', 'rockets', ->
      Crafty.e('PowerUp').powerUp(contains: 'rockets', marking: 'R')

    @sequence(
      @disableWeapons()
      @moveTo(x: 540, y: 200)
      @say('Large Drone', 'We have control now! You will suffer!')
      @say('Large Drone', 'Earths defences are in our hands!')
      @wait 500
      @enableWeapons()
      @moveTo(y: 205, speed: 5)
      @attackCycle()
    )

  attackCycle: ->
    @repeat @sequence(
      @async @runScript(Game.Scripts.Stage1BossMine, @location())
      @moveTo(y: 200, speed: 5)
      @wait 200
      @async @runScript(Game.Scripts.Stage1BossRocket, @location())
      @moveTo(y: 205, speed: 5)
      @wait 200
    )

  fase2: ->
    @bindSequence 'Hit', @fase3, => @entity.health < 120000

    @sequence(
      @setSpeed 50
      @attackCycle()
    )

  fase3: ->
    @sequence(
      @drop(location: @location(), item: 'rockets')
      @moveTo(x: 740, y: 100, speed: 100)
    )

class Game.Scripts.Stage1BossMine extends Game.EntityScript
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
      @moveTo(y: 525)
      @moveTo(@targetLocation(), y: 450)
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
  spawn: (location) ->
    Crafty.e('Rocket').rocket(
      health: 200
      x: location().x - 30
      y: location().y - 5 + Math.round(Math.random() * 10)
      speed: 400
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled

    @moveTo(x: -205)

  onKilled: ->
    @explosion(@location(), damage: 200, radius: 40)


class Game.Scripts.Stage1BossPopup extends Game.EntityScript

  spawn: ->
    Crafty.e('LargeDrone').drone(
      health: 160000
      x: 680
      y: 400
      speed: 100
    )

  execute: ->
    @bindSequence 'Hit', @leaveScreen, => @entity.health < 159000
    @inventoryAdd 'item', 'rockets', ->
      Crafty.e('PowerUp').powerUp(contains: 'rockets', marking: 'R')

    @sequence(
      @pickTarget('PlayerControlledShip')
      @moveTo(@targetLocation(), x: 540)
      @attackCycle()
    )

  leaveScreen: ->
    @sequence(
      @drop(location: @location(), item: 'rockets')
      @moveTo(x: 740, speed: 100)
    )

  attackCycle: ->
    @repeat @sequence(
      @async @runScript(Game.Scripts.Stage1BossRocket, @location())
      @parallel(
        @moveTo(@targetLocation(), x: 540)
        @wait 1000
      )
    )

