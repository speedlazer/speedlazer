Game = @Game
Game.Scripts ||= {}

class Game.Scripts.BossFight extends Game.LazerScript
  metadata:
    namespace: 'City'
    startScenery: 'Bay'
    armedPlayers: yes

  execute: ->
    @sequence(
      @setSpeed(2)
      @runScript(Game.Scripts.Stage1Boss)
      @say('Game', 'You Won!...')
    )
