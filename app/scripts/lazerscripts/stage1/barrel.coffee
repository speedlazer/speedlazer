Game = @Game
Game.Scripts ||= {}

class Game.Scripts.IntroBarrel extends Game.EntityScript

  spawn: ->
    Crafty.e('2D, Canvas, Tween, Color, Collision, Choreography, Hideable')
      .color('#606000')
      .attr({ z: 3, w: 10, h: 15, speed: 150 })
      .onHit 'PlayerControlledShip', ->
        @trigger('Knock')

  execute: ->
    @bindSequence 'Knock', @knockedOff
    @sequence(
      @pickTarget('BarrelLocation')
      @setLocation(@targetLocation(offsetY: -15))
      @wait 20000
    )

  knockedOff: ->
    @parallel(
      @moveTo y: 600
      @rotate 90, 1500
    )


