Game = @Game
Game.Scripts ||= {}

class Game.Scripts.SplashJumper extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 200
      x: 680
      y: 200
      speed: 300
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @moveTo x: 500
      @wait 3000
      @repeat @sequence(
        @moveTo y: 50
        @moveTo y: 600
      )
    )

  onKilled: ->
    @explosion(@location())
