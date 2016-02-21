Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Test extends Game.LazerScript
  assets: ->
    @loadAssets('shadow', 'explosion')

  execute: ->
    @sequence(
      @setScenery 'Bay'
      @async @runScript(Game.Scripts.SunRise, skipTo: 0, speed: 4)
      @setSpeed 0
      @wait 1000
      @placeSquad Game.Scripts.Stage1BossStage1
    )

