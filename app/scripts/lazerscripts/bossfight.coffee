Game = @Game
Game.Scripts ||= {}

class Game.Scripts.BossFight extends Game.LazerScript
  metadata:
    namespace: 'City'
    startScenery: 'Bay'
    armedPlayers: yes

  execute: ->
    @inventoryAdd 'enemy', 'default', ->
      Crafty.e('Drone').drone(health: 200)

    @sequence(
      @setSpeed(2)
      @runScript(Game.Scripts.Stage1Boss)
      @gainHeight(200, duration: 4000)
      @setScenery('Skyline')
      @runScript(Game.Scripts.Stage1Boss)
      @say('Game', 'You Won!...')
    )
