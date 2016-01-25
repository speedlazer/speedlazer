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
      @async @runScript(Game.Scripts.SunRise, skipTo: 0, speed: 16)
      #@setScenery 'Ocean'
      #@setScenery 'Bay'
      @setScenery 'UnderBridge'
      @setSpeed 0
    )
