Game = @Game
Game.Scripts ||= {}

class Game.Scripts.SplashJumper extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 200
      x: 680
      y: 200
      speed: 100
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @moveTo x: 500
      @wait 3000
      @repeat @sequence(
        @moveTo y: 50
        @moveTo x: 500
        @moveTo y: 600
        @moveTo x: 20
        @moveTo y: 50
      )
    )

  onKilled: ->
    @explosion(@location())
