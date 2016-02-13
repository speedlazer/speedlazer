Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Test extends Game.LazerScript
  metadata:
    namespace: 'City'
    armedPlayers: 'lasers'
    speed: 0
    title: 'Water Splashes'

  assets: ->
    @loadAssets('shadow', 'explosion')

  execute: ->
    @sequence(
      @setScenery 'Bay'
      @async @runScript(Game.Scripts.SunRise, skipTo: 0, speed: 4)
      @setSpeed 100
      @wait 1000
      #@placeSquad Game.Scripts.Stalker
      @placeSquad Game.Scripts.JumpMine,
        amount: 14
        delay: 300
        options:
          grid: new Game.LocationGrid
            x:
              start: 0.3
              steps: 12
              stepSize: 0.05
            y:
              start: 0.125
              steps: 12
              stepSize: 0.05
          points: yes
          direction: 'right'
    )
