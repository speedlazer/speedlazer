Game = @Game
Game.Scripts ||= {}

class Game.Scripts.JumpMine extends Game.EntityScript

  spawn: (options) ->
    x = if options.direction is 'right' then 720 else -80
    Crafty.e('Mine').mine(
      x: x
      y: 340
      speed: options.speed ? 200
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @moveTo(y: 450, speed: 400)
      @moveTo(x: @options.x())
      @moveTo(y: @options.y())
      @parallel(
        @sequence(
          @synchronizeOn 'placed'
          @moveTo(x: -50, speed: 35)
        )
        @sequence(
          @wait 5000
          @explosion(@location(), damage: 300, radius: 40)
          @endSequence()
        )
      )
    )

  onKilled: ->
    @explosion(@location(), damage: 300, radius: 40)


