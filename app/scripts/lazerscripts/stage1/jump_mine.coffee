Game = @Game
Game.Scripts ||= {}

class Game.Scripts.JumpMine extends Game.EntityScript

  spawn: (options) ->
    Crafty.e('Mine').drone(
      x: 720
      y: 340
      speed: options.speed ? 200
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled

    @sequence(
      @moveTo(x: 720, y: 450, speed: 400)
      @moveTo(x: @options.x())
      @moveTo(y: @options.y())
      @wait 2000
      @parallel(
        @moveTo(x: -50, speed: 35)
        @sequence(
          @wait 5000
          @explosion(@location(), damage: yes, radius: 40)
          @endSequence()
        )
      )
    )

  onKilled: ->
    @explosion(@location(), damage: yes, radius: 40)


