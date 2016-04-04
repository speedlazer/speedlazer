Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Train extends Game.EntityScript
  spawn: ->
    p = Crafty.e('Enemy, Color').attr(
      x: -1200
      y: 160
      defaultSpeed: 20
      health: 900
      w: 1100
      h: 270
    ).enemy(
      projectile: 'TrainBullet'
    ).color('#808080')
    p

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @bindSequence 'Progress', @progress
    @point = -1050
    @entity.currentY = @entity.y

    @sequence(
      @moveTo x: @point
      @repeat @sequence(
        @moveTo y: 165, speed: 10
        @moveTo y: 155, speed: 10
      )
    )

  progress: ->
    @bindSequence 'Progress', @progress

    p = @point
    @point += 200
    @sequence(
      @moveTo x: p - 40, speed: 50
      @wait 500
      @moveTo x: @point, speed: 150
      @repeat @sequence(
        @moveTo (=> y: @entity.currentY), speed: 10, positionType: 'absoluteY'
        @moveTo (=> y: @entity.currentY + 10), speed: 10, positionType: 'absoluteY'
      )
    )

  onKilled: ->
    @bigExplosion()


