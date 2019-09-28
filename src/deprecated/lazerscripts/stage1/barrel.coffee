{ EntityScript } = require('src/lib/LazerScript')
{ isPaused } = require('src/lib/core/pauseToggle')

class IntroBarrel extends EntityScript
  spawn: (@options = {}) ->
    Crafty.e('2D, WebGL, Tween, boxes, Collision, Choreography, Hideable')
      .attr({ z: 23, defaultSpeed: 150 })
      .onHit 'PlayerControlledShip', (c) ->
        return if isPaused()
        @trigger('Knock', c[0].obj)

  execute: ->
    @bindSequence 'Knock', @knockedOff
    @wait 20000

  knockedOff: (player) ->
    player.trigger 'BonusPoints', points: 25, location: @location()
    @parallel(
      => @entity.sprite(28, 38)
      @moveTo y: 1.25
      @rotate 90, 1500
    )

module.exports =
  default: IntroBarrel
