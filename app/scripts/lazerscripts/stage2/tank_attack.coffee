Game = @Game
Game.Scripts ||= {}

class Game.Scripts.TankAttack extends Game.EntityScript

  spawn: (options) ->
    p = Crafty.e('Tank').attr(
      x: Crafty.viewport.width + 40
      y: 400
      defaultSpeed: 30
      weaponOrigin: [30, 0]
    ).tank()

  execute: ->
    @bindSequence 'Destroyed', @onKilled

    @sequence(
      @moveTo x: .2
      @wait 200
      @moveTo x: .8
    )

  onKilled: ->
    @sequence(
      @deathDecoy()
      @bigExplosion()
      @wait 200
      @bigExplosion()
      =>
        @entity.removeComponent('ViewportFixed')
        @entity.color('#100000')
      @wait 10000
      @endDecoy()
    )


