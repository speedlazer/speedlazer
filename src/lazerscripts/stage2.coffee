{ LazerScript } = require('src/lib/LazerScript')
StageEnd = require('./stage1end').default
HeliAttack = require('./stage1/heli_attack').default
TankAttack = require('./stage2/tank_attack').default
SunRise = require('./stage1/sunrise').default

class Stage2 extends LazerScript
  nextScript: StageEnd

  assets: ->
    @loadAssets('explosion')

  execute: ->
    @sequence(
      @if((-> @player(1).active and !@player(2).active)
        @sequence(
          @say 'John', 'I\'ll try to find another way in!'
          @say 'General', 'There are rumours about an underground entrance', noise: 'low'
          @say 'John', 'Ok I\'ll check it out'
        )
      )
      @if((-> !@player(1).active and @player(2).active)
        @sequence(
          @say 'Jim', 'I\'ll use the underground tunnels!'
          @say 'General', 'How do you know about those...\n' +
            'that\'s classified info!', noise: 'low'
        )
      )
      @if((-> @player(1).active and @player(2).active)
        @sequence(
          @say 'John', 'We\'ll try to find another way in!'
          @say 'Jim', 'We can use the underground tunnels!'
          @say 'General', 'How do you know about those...\n' +
            'that\'s classified info!', noise: 'low'
        )
      )
      @setScenery 'Skyline2'
      # Add enemies during decent
      @chapterTitle(2, 'Underground')
      @showText 'Get Ready', color: '#00FF00', mode: 'blink', blink_amount: 3, blink_speed: 300
      @parallel(
        @gainHeight(-1300, duration: 30000)
        @placeSquad HeliAttack,
          amount: 3
          delay: 6000
      )
      @checkpoint @checkpointStreets('Skyline2')
      @placeSquad TankAttack
      @placeSquad HeliAttack
      @wait 8000
    )

  checkpointStreets: (scenery) ->
    @sequence(
      @setScenery(scenery)
      @async @runScript(SunRise, skipTo: 10 * 60 * 1000)
      # TODO: Seriously drop some powerups for players to catch up a little
      @wait 6000
    )

module.exports =
  default: Stage2
