Game = @Game
Game.Scripts ||= {}

class Game.Scripts.IntroBarrel extends Game.EntityScript

  spawn: ->
    Crafty.e('2D, WebGL, Tween, Color, Collision, Choreography, Hideable')
      .color('#606000')
      .attr({ z: 3, w: 10, h: 15, speed: 150 })
      .onHit 'PlayerControlledShip', (c) ->
        return if Game.paused
        @trigger('Knock', c[0].obj)

  execute: ->
    @bindSequence 'Knock', @knockedOff
    @sequence(
      @pickTarget('BarrelLocation')
      @setLocation(@targetLocation(offsetY: -15))
      @wait 20000
    )

  knockedOff: (player) ->
    player.trigger 'BonusPoints', 25
    @parallel(
      @moveTo y: 1.25
      @rotate 90, 1500
    )


