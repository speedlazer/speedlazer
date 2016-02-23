Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Train extends Game.EntityScript
  spawn: ->
    p = Crafty.e('Enemy, Color').attr(
      x: -1200
      y: 160
      speed: 20
      health: 900
      w: 1100
      h: 270
    ).enemy().color('#808080')
    p

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @bindSequence 'Stage2', @stage2

    @sequence(
      @moveTo x: -1050
      @repeat @sequence(
        @moveTo y: 165, speed: 10
        @moveTo y: 155, speed: 10
      )
    )

  stage2: ->
    @sequence(
      @moveTo x: -850
      @repeat @sequence(
        @moveTo y: 165, speed: 10
        @moveTo y: 155, speed: 10
      )
    )

  onKilled: ->
    @bigExplosion()


