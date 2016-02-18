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
      @say 'DesignNote', 'Add some enemies and setting here!'
      @wait 3000
      @gainHeight(-580, duration: 4000)

      #@say 'Game', 'End of gameplay for now... \nStarting endless enemies'
      #@repeat @mineSwarm(points: no)
    )
