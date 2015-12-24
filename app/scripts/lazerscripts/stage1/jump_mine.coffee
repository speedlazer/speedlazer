Game = @Game
Game.Scripts ||= {}

class Game.Scripts.JumpMine extends Game.EntityScript

  assets: ->
    @loadAssets(
      sprites:
        'mine.png':
          tile: 25
          tileh: 25
          map:
            standardMine: [0,0]
          paddingX: 1
    )

  spawn: (options) ->
    x = if options.direction is 'right' then Crafty.viewport.width + 80 else -80
    @target = options.grid.getLocation()
    Crafty.e('Mine').mine(
      x: x
      y: 340
      speed: options.speed ? 200
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @moveTo(y: 1.05, speed: 400)
      @moveTo(x: @target.x)
      @moveTo(y: @target.y)
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
          @explosion(@location(), damage: 300, radius: 40)
          @endSequence()
        )
      )
    )

  onKilled: ->
    @explosion(@location(), damage: 300, radius: 40)


