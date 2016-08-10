Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage2 extends Game.LazerScript

  assets: ->
    @loadAssets('explosion')

  execute: ->

    @sequence(
      @if((-> @player(1).active and !@player(2).active)
        @sequence(
          @say 'John', 'I\'ll try to find another way in!'
          @say 'General', 'There are rumours about an underground entrance'
          @say 'John', 'Ok I\'ll check it out'
        )
      )
      @if((-> !@player(1).active and @player(2).active)
        @sequence(
          @say 'Jim', 'I\'ll use the underground tunnels!'
          @say 'General', 'How do you know about those...\n' +
            'that\'s classified info!'
        )
      )
      @if((-> @player(1).active and @player(2).active)
        @sequence(
          @say 'John', 'We\'ll try to find another way in!'
          @say 'Jim', 'We can use the underground tunnels!'
          @say 'General', 'How do you know about those...\n' +
            'that\'s classified info!'
        )
      )
      @setScenery 'Skyline2'
      @changeSeaLevel 500
      # Add enemies during decent
      @parallel(
        @gainHeight(-1300, duration: 20000)
        @chapterTitle(2, 'Underground')
      )
      @checkpoint @checkpointStreets('Skyline2')
      @say 'DesignNote', 'Add some enemies and setting here!'
      @placeSquad Game.Scripts.HeliAttack,
        options:
          ground: .8
      @wait 8000
    )

  checkpointStreets: (scenery) ->
    @sequence(
      @setScenery(scenery)
      @async @runScript(Game.Scripts.SunRise, skipTo: 10 * 60 * 1000)
      # TODO: Seriously drop some powerups for players to catch up a little
      @wait 6000
    )
