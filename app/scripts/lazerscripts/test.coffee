Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Test extends Game.LazerScript
  metadata:
    namespace: 'City'
    armedPlayers: 'lasers'
    speed: 0
    title: 'WebGL-Shaders'

  assets: ->
    @loadAssets('general')

  execute: ->
    @sequence(
      @setScenery 'Bay'
      @async @runScript(Game.Scripts.SunRise, skipTo: 0, speed: 4)
      @setSpeed 100
      @wait 1000
      @setScenery 'UnderBridge'
      @waitForScenery 'UnderBridge', event: 'inScreen'
      @setSpeed 0
      @placeSquad Game.Scripts.Stage1BossStage1
      @setScenery 'UnderBridge'
    )
