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
      @moveTo x: .2, speed: 120
      @action('searchAim')
      @while(
        @sequence( # movement pattern
          @wait 200
          @moveTo x: .8
          @wait 4000
          @moveTo x: -.2
        )
        @sequence( # attack pattern
          @action 'shoot'
          @wait 1000
          @action 'searchAim'
        )
      )
    )

  onKilled: ->
    @leaveAnimation @sequence(
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


