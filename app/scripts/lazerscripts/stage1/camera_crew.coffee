class Game.Scripts.CameraCrew extends Game.EntityScript

  assets: ->
    @loadAssets('helicopter')

  spawn: (options) ->
    Crafty.e('CameraCrew, Horizon')
      .attr(
        x: (Crafty.viewport.width * .2) - Crafty.viewport.x
        y: Crafty.viewport.height * .15
        defaultSpeed: 100
        topDesaturation: 0.3
        bottomDesaturation: 0.3
      ).cameraCrew()

  execute: ->
    @entity.colorDesaturation Game.backgroundColor
    @bindSequence 'Hit', @crash
    @sequence(
      @sendToBackground(0.85, -1)
      @setLocation x: 0.45, y: .4
      @moveTo x: -0.3, speed: 200
      @turnAround()
      @wait 200
      @sendToBackground(0.5, -200)
      @moveTo x: .22, y: .45
      @repeat @sequence(
        @parallel(
          @scale(0.7, duration: 4000)
          @moveTo x: .36, y: .47, speed: 25, easing: 'easeInOutQuad'
        )
        @parallel(
          @scale(0.5, duration: 4000)
          @moveTo x: .22, y: .5, speed: 25, easing: 'easeInOutQuad'
        )
      )
    )

  crash: ->
    @sequence(
      @parallel(
        @screenShake(5, duration: 400)
        @blast(@location(),
          duration: 480,
          z: -199
          topDesaturation: 0.3
          bottomDesaturation: 0.3
        )
        => Crafty.audio.play("explosion")
      )
      => @entity.flip('Y')
      @turnAround()
      @while(
        @movePath [
          [.62, .68]
        ], speed: 150
        @sequence(
          @blast(@location(offSetX: 0, offsetY: 10),
            radius: 10,
            duration: 480,
            z: -199
            topDesaturation: 0.3
            bottomDesaturation: 0.3
            lightness: .2
            alpha: .5
          )
          @blast(@location(offsetX: 10, offsetY: 25),
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

