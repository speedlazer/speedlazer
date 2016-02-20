Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Train extends Game.EntityScript
  spawn: ->
    console.log 'spawning train'

    p = Crafty.e('Enemy, Color').attr(
      x: -1200
      y: 60
      speed: 20
      health: 900
      w: 1100
      h: 370
    ).enemy().color('#808080')
    p

  execute: ->
    @bindSequence 'Destroyed', @onKilled

    @sequence(
      => console.log 'Moving!'
      @moveTo x: .1
      @wait 20000
      @bigExplosion()
    )

  onKilled: ->
    @bigExplosion()


