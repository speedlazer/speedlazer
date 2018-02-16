{ EntityScript } = require('src/lib/LazerScript')

class CameraCrew extends EntityScript

  assets: ->
    @loadAssets('helicopter')

  spawn: (options) ->
    Crafty.e('CameraCrew, Horizon')
      .attr(
        x: (Crafty.viewport.width * .2)
        y: Crafty.viewport.height * .15
        defaultSpeed: 100
        topDesaturation: 0.3
        bottomDesaturation: 0.3
        rotation: -5
      ).cameraCrew()

  execute: ->
    @entity.colorDesaturation Game.backgroundColor
    @bindSequence 'Hit', @takeOver
    @sequence(
      @sendToBackground(0.85, -1)
      @setLocation x: 0.45, y: .4
      @moveTo x: -0.3, speed: 200
      @turnAround()
      @rotate(8, 0)
      @wait 200
      @sendToBackground(0.8, -100)
      @moveTo x: .22, y: .45
      @repeat @sequence(
        @parallel(
          @scale(0.9, duration: 4000)
          @moveTo x: .36, y: .47, speed: 25, easing: 'easeInOutQuad'
        )
        @parallel(
          @scale(0.8, duration: 4000)
          @moveTo x: .22, y: .5, speed: 25, easing: 'easeInOutQuad'
        )
      )
    )

  takeOver: ->
    @sequence(
      @parallel(
        @addMajorScreenshake()
        @blast(@location(),
          duration: 480,
          z: -199
          topDesaturation: 0.3
          bottomDesaturation: 0.3
          alpha: .5
        )
      )
      @parallel(
        @placeSquad EjectionChute,
          amount: 3
          delay: 800
          options:
            startAt: 'CameraCrew'
            dx: 32
            dy: 20

        @sequence(
          @moveTo(x: .55)
          @movePath [
            [.65, .75]
            [.6, .69]
            [.9, .6]
            [1.0, .65]
            [1.2, .7]
          ], rotate: no, speed: 150

        )
      )
    )

Crafty.c('Parachutist', {
  required: '2D, WebGL, Choreography, Collision, Hideable, chute, Flipable, Scalable, Tween'
  init: ->
    @origin 'center'
})

class EjectionChute extends EntityScript

  spawn: (options) ->
    x = Crafty.viewport.width + 40
    x = options.x if options.x
    x = Crafty(options.startAt).get(0).x if options.startAt
    x += options.dx if options.dx

    y = Crafty.viewport.height * .4
    y = options.y if options.y
    y = Crafty(options.startAt).get(0).y if options.startAt
    y += options.dy if options.dy

    Crafty.e('Parachutist').attr(
      x: x
      y: y
      z: 100
      defaultSpeed: options.speed ? 40
      juice: options.juice
    )

  execute: ->
    @sequence(
      @sendToBackground(0.8, -102)
      @while(
        @moveTo(
          y: 1.15
        )
        @sequence(
          @rotate(10, 1200)
          @rotate(-10, 1200)
        )
      )
    )

module.exports =
  default: CameraCrew
