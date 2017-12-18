{ EntityScript } = require('src/lib/LazerScript')

class IntroBarrel extends EntityScript
  spawn: (@options = {}) ->
    Crafty.e('2D, WebGL, Tween, boxes, Collision, Choreography, Hideable')
      .attr({ z: 23, defaultSpeed: 150 })
      .onHit 'PlayerControlledShip', (c) ->
        return if Game.paused
        @trigger('Knock', c[0].obj)

  execute: ->
    @bindSequence 'Knock', @knockedOff
    @sequence(
      @pickTarget('BoxesLocation', @options.index)
      @setLocation(@targetLocation(offsetY: -15))
      @wait 20000
    )

  knockedOff: (player) ->
    player.trigger 'BonusPoints', points: 25, location: @location()
    @parallel(
      => @entity.sprite(28, 38)
      @moveTo y: 1.25
      @rotate 90, 1500
    )

module.exports =
  default: IntroBarrel
