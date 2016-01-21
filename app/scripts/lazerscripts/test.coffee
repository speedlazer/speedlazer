Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Test extends Game.LazerScript
  metadata:
    namespace: 'City'
    armedPlayers: 'lasers'
    speed: 0
    title: 'WebGL-Shaders'

  assets: ->
    @loadAssets('test',
      images: ['city.png']
    )

  execute: ->
    @sequence(
      @setScenery 'Bay'
      @setScenery 'UnderBridge'
      @setSpeed 25
      @async @runScript(Game.Scripts.SunRise, skipTo: 200000, speed: 1)
    )
