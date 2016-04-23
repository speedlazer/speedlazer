Game = @Game
Game.Scripts ||= {}

class Game.Scripts.StalkerChain extends Game.EntityScript

  spawn: (options) ->
    @target = options.grid.getLocation()
    Crafty.e('Drone,Tween,ShootOnSight').drone(
      health: 100
      x: 680
      y: 400
      defaultSpeed: 300
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @moveTo(x: 680, y: 550)
      @moveTo(x: 600)
      @moveTo(y: @target.y)
      @synchronizeOn 'placed'
      @rotate 90, 500
      @moveTo x: 600, y: 110, speed: 200
      @movePath [
        [600, 100]
        [500, 50]
        [300, 350]
        [-50, 250]
      ]
    )

  onKilled: ->
    @blast(@location())

