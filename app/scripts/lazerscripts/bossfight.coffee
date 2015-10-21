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
      @gainHeight(200, duration: 4000)
      @setScenery('Skyline')
      @runScript(Game.Scripts.Stage1Boss)
      @say('Game', 'You Won!...')
    )
