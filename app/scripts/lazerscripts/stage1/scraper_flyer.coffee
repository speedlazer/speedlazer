Game = @Game
Game.Scripts ||= {}

class Game.Scripts.ScraperFlyer extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone,ShootOnSight').drone(
      health: 200
      x: -50
      y: Crafty.viewport.height * .7
      speed: 200
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @sendToBackground(0.5, -400)
      @parallel(
        @movePath [
          [.6, .8]
          [.8, .3]
          [.5, .1]
          [.2, .25]
          [.5, .7]
          [.8, .4]
          [.4, .2]
          [-.1, .4]
        ]
        @sequence(
          @wait 3000
          @scale(1.0, duration: 3000)
          @reveal()
        )
      )
    )

  onKilled: ->
    @explosion(@location())
