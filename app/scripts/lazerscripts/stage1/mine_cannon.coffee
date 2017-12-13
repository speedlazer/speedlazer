Game = @Game
Game.Scripts ||= {}

class Game.Scripts.MineCannon extends Game.EntityScript

  spawn: (options) ->
    point = Crafty(options.attach).get(0)
    p = Crafty.e('Drone, KeepAlive').removeComponent(
      'ViewportFixed'
    ).drone()

    point.attach(p)
    p.attr({
      x: point.x
      y: point.y
      z: 12
      invincible: false
    })
    p

  execute: ->
    @wait(1)

