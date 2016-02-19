Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage2 extends Game.LazerScript

  assets: ->
    @loadAssets('shadow', 'explosion')

  execute: ->
    @sequence(
      @changeSeaLevel 500
      @parallel(
        @gainHeight(-580, duration: 6000)
        @chapterTitle(2, 'Underground')
      )
      #@say 'DesignNote', 'Add some enemies and setting here!'
      #@wait 3000
      #@gainHeight(-580, duration: 4000)

      @say 'Game', 'End of gameplay for now... \nStarting endless enemies'
      @repeat @mineSwarm(points: no)
    )

  mineSwarm: (options = { direction: 'right' })->
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
        points: options.points ? yes
        direction: options.direction
