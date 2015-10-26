Game = @Game
Game.Scripts ||= {}

class Game.Scripts.BossFight extends Game.LazerScript
  metadata:
    namespace: 'City'
    startScenery: 'Bay'
    armedPlayers: yes
    title: 'City'
    stage: 1

  execute: ->
    @sequence(
      @setSpeed(1)
      @runScript(Game.Scripts.Stage1Boss)
      #@gainHeight(250, duration: 4000)
      #@setScenery('Skyline')
      #@runScript(Game.Scripts.Stage1Boss)
      #@showScore()
      @say('Game', 'You Won!...')
    )
