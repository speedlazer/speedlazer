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
      @sendToBackground(0.85, -100)
      @setLocation x: 0.45, y: .4
      @moveTo x: -.1
      @wait 200
      @sendToBackground(0.75, -200)
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
          @explosion(@location(offsetX: -40, offsetY: -20))
          @wait 200
        )
      )
      @moveTo y: 1.1
    )

