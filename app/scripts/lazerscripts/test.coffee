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
      @setSpeed 50
      @wait 1000
      @setScenery 'UnderBridge'
    )
