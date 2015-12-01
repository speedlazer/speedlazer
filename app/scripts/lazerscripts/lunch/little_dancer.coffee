Game = @Game
Game.Scripts ||= {}

class Game.Scripts.LittleDancer extends Game.EntityScript

  spawn: (options) ->
    @wallTarget = options.grid.getLocation()
    @index = (@wallTarget.x - 150) / 100

    Crafty.e('Drone').drone(
      health: 1900
      x: 680
      y: 270
      speed: 100
    )

  execute: ->
    @sequence(
      @if((=> @index is 0),
        @say('Enemy squad', 'Welcome to our little dance!')
      )
      @moveTo(x: @wallTarget.x)
      @synchronizeOn 'placed'

      @moveTo(x: @wallTarget.x + 20)
      @moveTo(y: 305)
      @repeat 2, @sequence(
        @moveTo(x: @wallTarget.x + 30)
        @wait 500
        @moveTo(x: @wallTarget.x + 20)
        @wait 500
      )
      @wait (@index * 500)
      @moveTo(y: 290)
      @wait 100
      @moveTo(y: 310)
      @synchronizeOn 'afterJump'
      @moveTo(x: 100)
      @movePath([
        [30, 240]
        [450, 210]
      ], speed: 200)
      @explosion(@location())
    )

