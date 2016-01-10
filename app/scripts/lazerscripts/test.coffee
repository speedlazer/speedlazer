Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Test extends Game.LazerScript
  metadata:
    namespace: 'City'
    armedPlayers: 'lasers'
    speed: 0
    title: 'WebGL-Shaders'

  execute: ->
    Crafty.e('2D, WebGL, Image')
      .image('images/water-horizon.png')
      .attr(
        x: 40
        y: 50
        z: -600
      )

    => WhenJS()
