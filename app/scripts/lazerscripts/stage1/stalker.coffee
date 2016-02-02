Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stalker extends Game.EntityScript
  assets: ->
    @loadAssets('drone')

  spawn: ->
    Crafty.e('Drone').drone(
      health: 100
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .83
      speed: 600
      pointsOnHit: 125
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @pickTarget('PlayerControlledShip')
      @moveTo(x: 1.1, y: 1.01)
      @repeat(5, @sequence(
        @moveTo(@targetLocation(), y: 1.01, speed: 200, easing: 'easeInOutQuad')
        @wait 100
      ))
      @moveTo(y: .7, speed: 200)

      # Wobble once before moving up
      @wait 100
      @moveTo(y: .73, speed: 100)
      @wait 100
      @moveTo(y: .7, speed: 100)

      @moveTo(y: -50)
    )

  onKilled: ->
    @explosion(@location())
