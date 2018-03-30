PresentationLeaveScreen = require('./lunch/presentation_leave_screen').default
{ LazerScript, EntityScript } = require('src/lib/LazerScript')
Stage1End = require('./stage1end').default
Dinosaur = require('./trailer/dinosaur').default

class TrailerDino extends LazerScript
  nextScript: Stage1End

  assets: ->
    @loadAssets('explosion')

  execute: ->
    @sequence(
      @parallel(
        @sequence(
          @disableControls()
          @disableWeapons()
          @placeSquad(PresentationLeaveScreen,
            amount: 2
            delay: 1000
          )
        )
        @sequence(
          @say 'This is it for now!\nMore content coming soon!'
          @say 'Thanks for playing!\nThe heroes will return...'
        )
      )
      @screenFadeOut()
      @setScenery('Trailer.Dino')
      @setSpeed 2000, accellerate: no
      @waitForScenery('Trailer.Dino', event: 'enter')
      @placeSquad(ShipReset,
        amount: 2
        delay: 0
      )
      @changeSeaLevel 500
      @wait 100
      @setSpeed 100, accellerate: no
      @screenFadeIn()
      @enableControls()
      @enableWeapons()
      @repeat(5, @sequence(
        @addMinorScreenshake()
        @wait 1000
      ))

      @setSpeed 0
      @placeSquad(Dinosaur)

      @wait 10e3
    )


class ShipReset extends EntityScript

  spawn: (options) ->
    ship = undefined
    Crafty('PlayerControlledShip').each ->
      ship = this if @playerNumber is options.index + 1
    if ship?
      ship.addComponent 'Tween', 'Choreography', 'AnimationMode', 'KeepAlive'
    ship

  execute: ->
    @sequence(
      @rotate 0, 20
      @moveTo x: .1, y: .45 + (@options.index * .1), speed: 1000, easing: 'easeInOutQuad'
    )

module.exports =
  default: TrailerDino
