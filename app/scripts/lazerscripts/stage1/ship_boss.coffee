Game = @Game
Game.Scripts ||= {}

class Game.Scripts.ShipBoss extends Game.EntityScript

  spawn: (options) ->
    Crafty.e('BattleShip').attr(
      x: Crafty.viewport.width + 180
      y: 400
      defaultSpeed: options.speed ? 350
    ).setSealevel(@level.visibleHeight - 10)

  execute: ->
    @sequence(
      @moveTo(x: 0.02)
      @wait(5000)
      @moveTo(x: -1.5)
    )

