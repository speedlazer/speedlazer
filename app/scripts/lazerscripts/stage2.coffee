Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage2 extends Game.LazerScript

  assets: ->
    @loadAssets('shadow', 'explosion')

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L').color('#2020FF')
    @inventoryAdd 'item', 'xp', ->
      Crafty.e('PowerUp').powerUp(contains: 'xp', marking: 'X')
    @inventoryAdd 'item', 'diagonals', ->
      Crafty.e('PowerUp').powerUp(contains: 'diagonals', marking: 'D').color('#8080FF')

    @sequence(
      @setScenery 'Skyline2'
      @changeSeaLevel 500
      @parallel(
        @gainHeight(-580, duration: 6000)
        @chapterTitle(2, 'Underground')
      )
      @say 'DesignNote', 'Add some enemies and setting here!'
      @wait 8000
      @setScenery('TrainTunnel')
      @gainHeight(-580, duration: 4000)
      @checkpoint @checkpointUnderground('TrainTunnel')
      @setScenery('SmallerTrainTunnel')
      @async @placeSquad Game.Scripts.Train,
        options:
          identifier: 'Train'

      @wait 15000
      @say 'Game', 'Train attack!'
      => Crafty('Train0').trigger 'Stage2'
      @wait 15000
      @say 'Game', 'Train attack!'
      @wait 5000


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
        direction: options.direction ? 'right'

  dropDiagonalsForEachPlayer: ->
    @parallel(
      @if((-> @player(1).active and !@player(1).has('diagonals')), @drop(item: 'diagonals', inFrontOf: @player(1)))
      @if((-> @player(2).active and !@player(2).has('diagonals')), @drop(item: 'diagonals', inFrontOf: @player(2)))
    )

  checkpointUnderground: (scenery) ->
    @sequence(
      @setScenery(scenery)
      @dropDiagonalsForEachPlayer()
      @wait 6000
    )
