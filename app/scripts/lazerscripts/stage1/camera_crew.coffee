Game = @Game
Game.Scripts ||= {}

class Game.Scripts.CameraCrew extends Game.EntityScript

  assets: ->
    @loadAssets(
      sprites:
        'camera-helicopter.png':
          tile: 120
          tileh: 50
          map:
            cameraHelicopter: [0,0]
          paddingX: 1
    )

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
      => @entity.flip('X')
      @wait 200
      @sendToBackground(0.75, -200)
      @moveTo x: .22, y: .45
      @repeat @sequence(
        @moveTo x: .36, y: .47, speed: 25, easing: 'easeInOutQuad'
        @moveTo x: .22, y: .5, speed: 25, easing: 'easeInOutQuad'
      )
    )

  crash: ->
    @sequence(
      @while(
        @movePath [
          [.6, .82]
        ], speed: 150
        @sequence(
          @explosion(@location(), radius: 10)
          @wait 200
        )
      )
      @moveTo y: 1.1
    )

