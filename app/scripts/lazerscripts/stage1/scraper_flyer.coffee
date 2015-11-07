Game = @Game
Game.Scripts ||= {}

class Game.Scripts.ScraperFlyer extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone,ShootOnSight').drone(
      health: 200
      x: -50
      y: 300
      speed: 200
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @sendToBackground(0.5, -400)
      @movePath [
        [420, 270]
        [520, 150]
        [320, 50]
      ]
      @reveal()
      @movePath [
        [120, 150]
        [220, 250]
        [620, 350]
      ]
    )

  onKilled: ->
    @explosion(@location())
