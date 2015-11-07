Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stalker extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 100
      x: 680
      y: 400
      speed: 300
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @pickTarget('PlayerControlledShip')
      @moveTo(x: 680, y: 450)
      @repeat(10, @sequence(
        @moveTo(@targetLocation(), y: 450, speed: 200)
        @wait 100
      ))
      @moveTo(y: -50)
    )

  onKilled: ->
    @explosion(@location())
