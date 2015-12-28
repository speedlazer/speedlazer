Game = @Game
Game.Scripts ||= {}

class Game.Scripts.CameraCrew extends Game.EntityScript

  spawn: (options) ->
    Crafty.e('CameraCrew')
      .attr(
        x: (Crafty.viewport.width * .2) - Crafty.viewport.x
        y: Crafty.viewport.height * .2
        speed: 100
      ).cameraCrew()

  execute: ->
    @bindSequence 'Hit', @crash
    @sequence(
      @sendToBackground(0.75, -200)
      @setLocation x: 0.6, y: .4
      @moveTo x: -.2
      @moveTo x: .22, y: .45
      @repeat @sequence(
        @moveTo x: .36, y: .42, speed: 50
        @moveTo x: .22, y: .45, speed: 50
      )
    )

  crash: ->
    @sequence(
      @parallel(
        @movePath [
          [.6, .8]
        ], speed: 150
        @repeat 13, @sequence(
          @explosion(@location())
          @wait 200
        )
      )
      @moveTo y: 1.1
    )

