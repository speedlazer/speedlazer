Game = @Game
Game.Scripts ||= {}

class Game.Scripts.CameraCrew extends Game.EntityScript

  assets: ->
    @loadAssets('helicopter')

  spawn: (options) ->
    Crafty.e('CameraCrew, Horizon')
      .attr(
        x: (Crafty.viewport.width * .2) - Crafty.viewport.x
        y: Crafty.viewport.height * .2
        speed: 100
        topDesaturation: 0.3
        bottomDesaturation: 0.3
      ).cameraCrew()

  execute: ->
    @entity.colorDesaturation Game.backgroundColor
    @bindSequence 'Hit', @crash
    @sequence(
      @sendToBackground(0.85, -100)
      @setLocation x: 0.45, y: .4
      @moveTo x: -.1
      => @entity.flip('X')
      @wait 200
      @sendToBackground(0.75, -200)
      @moveTo x: .22, y: .45
      @repeat @sequence(
        @moveTo x: .36, y: .47, speed: 25, easing: 'easeInOutQuad'
        @moveTo x: .25, y: .5, speed: 25, easing: 'easeInOutQuad'
      )
    )

  crash: ->
    @sequence(
      @parallel(
        @screenShake(5, duration: 400)
        @explosion(@location(),
          duration: 480,
          z: -199
          topDesaturation: 0.3
          bottomDesaturation: 0.3
        )
      )
      =>
        @entity.flip('Y')
        @entity.unflip('X')
      @while(
        @movePath [
          [.6, .82]
        ], speed: 150
        @sequence(
          @explosion(@location(),
            radius: 10,
            duration: 480,
            z: -199
            topDesaturation: 0.3
            bottomDesaturation: 0.3
            lightness: .2
            alpha: .5
          )
          @explosion(@location(offsetX: 10, offsetY: 5),
            radius: 5,
            duration: 180,
            z: -199
            topDesaturation: 0.3
            bottomDesaturation: 0.3
          )
          @wait 100
        )
      )
      @moveTo y: 1.1
    )

