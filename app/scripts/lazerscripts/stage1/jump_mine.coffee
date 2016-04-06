Game = @Game
Game.Scripts ||= {}

class Game.Scripts.JumpMine extends Game.EntityScript

  assets: ->
    @loadAssets('mine')

  spawn: (options) ->
    x = if options.direction is 'right' then Crafty.viewport.width + 80 else -80
    @target = options.grid.getLocation()
    @juice = options.juice ? yes

    Crafty.e('Mine').mine(
      x: x
      y: 340
      defaultSpeed: options.speed ? 200
      pointsOnHit: if options.points then 10 else 0
      pointsOnDestroy: if options.points then 50 else 0
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @moveTo(y: 1.05, speed: 400)
      @moveTo(x: @target.x, easing: if @juice then 'easeOutQuad' else 'linear')
      @moveTo(y: @target.y, easing: if @juice then 'easeOutQuad' else 'linear')
      @parallel(
        @sequence(
          @synchronizeOn 'placed'
          @animate('open')
          @wait 200
          @moveTo(x: -50, speed: 35)
        )
        @sequence(
          @wait 4000
          @animate('blink', -1)
          @wait 1000
          @onKilled()
          @endSequence()
        )
      )
    )

  onKilled: ->
    @bigExplosion(juice: @juice)

