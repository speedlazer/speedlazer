Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Test extends Game.LazerScript
  metadata:
    namespace: 'City'
    armedPlayers: 'lasers'
    speed: 0
    title: 'WebGL-Shaders'

  execute: ->
    @sequence(
      @setScenery 'Bay'
      @async @runScript(Game.Scripts.SunRise, skipTo: 0, speed: 8)
      @setSpeed 150
      #@setScenery 'Ocean'
      @setScenery 'UnderBridge'
      @waitForScenery 'UnderBridge'
      @setSpeed 25
      #@setSpeed 50
    )
