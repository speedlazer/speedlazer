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
      @setScenery 'Ocean'
      @async @runScript(Game.Scripts.SunRise, skipTo: 0, speed: 8)
      @setSpeed 0
    )
