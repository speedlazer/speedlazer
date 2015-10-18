Game = @Game
Game.Scripts ||= {}

class Game.Scripts.BossFight extends Game.LazerScript
  metadata:
    namespace: 'City'
    startScenery: 'Bay'
    armedPlayers: yes

  execute: ->
    @sequence(
      @setSpeed(0)
      @runScript(Game.Scripts.Stage1Boss)
    )
