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
      @setScenery 'Bay'
      @setSpeed 150
      @setScenery 'UnderBridge'
      @waitForScenery 'UnderBridge'
      #@setSpeed 0
      @setSpeed 50
    )
