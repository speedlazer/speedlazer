Game = @Game
Game.Scripts ||= {}

class Game.Scripts.BossFight extends Game.LazerScript
  metadata:
    namespace: 'City'
    startScenery: 'Ocean'
    armedPlayers: yes
    title: 'City'
    stage: 1

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L')

    @sequence(
      @setSpeed(1)
      @wait 3000
      @placeSquad Game.Scripts.Swirler,
        amount: 4
        delay: 500
        drop: 'lasers'
      @gainHeight(250, duration: 4000)
      #@setScenery('Skyline')
      #@runScript(Game.Scripts.Stage1Boss)
      @showScore()
      @say('Game', 'You Won!...')
    )
