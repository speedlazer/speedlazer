extend = require('lodash/extend')
{ LazerScript } = require('src/lib/LazerScript')
{ Stage1BossLeaving, Stage1BossPopup, Stage1BossRocketStrike } = require('./stage1/stage1boss')
{ ScraperFlyer, Swirler, Shooter, Stalker } = require('./stage1/army_drone')
{ Noon, Morning } = require('./stage1/sunrise')
JumpMine = require('./stage1/jump_mine').default
PlayerClone = require('./stage1/player_clone').default
HeliAttack = require('./stage1/heli_attack').default
StageEnd = require('./stage1end').default
HeliAttack = require('./stage1/heli_attack').default
TankAttack = require('./stage2/tank_attack').default

class Stage2 extends LazerScript
  nextScript: StageEnd

  assets: ->
    @loadAssets('explosion')

  execute: ->
    @sequence(
      @checkpoint @checkpointMidStage('BayFull', 400000)
      @say('General', 'Hunt him down! We need that AI control back!', noise: 'low')
      @chapterTitle(2, 'City')
      @setSpeed 200
      @showText 'Get Ready', color: '#00FF00', mode: 'blink', blink_amount: 3, blink_speed: 300
      @bossfightReward()
      @skylineFighting()
      @highSkylineFighting()
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
      @async @runScript(Noon, skipTo: 10 * 60 * 1000)
      # TODO: Seriously drop some powerups for players to catch up a little
      @wait 6000
    )

  bossfightReward: ->
    @sequence(

      #@setPowerupPool 'rapidb', 'speedb', 'aimb', 'speed', 'rapidb'

      @parallel(
        @sequence(
          @wait 4000
          @gainHeight(800, duration: 14000)
        )
        @sequence(
          @stalkerShootout()
          @setScenery('Skyline')
          @placeSquad Shooter,
            amount: 8
            delay: 500
            drop: 'pool'
            options:
              shootOnSight: yes
          @attackWaves(
            @parallel(
              @placeSquad Shooter,
                amount: 8
                delay: 500
                options:
                  shootOnSight: yes
              @placeSquad Swirler,
                amount: 8
                delay: 500
                options:
                  shootOnSight: yes
            )
            drop: 'pool'
          )
        )
      )
    )

  skylineFighting: ->
    @sequence(
      @setSpeed 100
      @checkpoint @checkpointMidStage('Skyline', 450000)
      @changeSeaLevel 500

      #@setPowerupPool 'damageb', 'damage', 'aimb', 'rapidb', 'damage', 'damageb'
      @attackWaves(
        @parallel(
          @placeSquad ScraperFlyer,
            amount: 8
            delay: 500
          @placeSquad Shooter,
            amount: 8
            delay: 500
            options:
              shootOnSight: yes
        )
        drop: 'pool'
      )
      @sunRise()
      @parallel(
        @attackWaves(
          @parallel(
            @placeSquad ScraperFlyer,
              amount: 8
              delay: 500
            @placeSquad Shooter,
              amount: 8
              delay: 500
              options:
                shootOnSight: yes
          )
          drop: 'pool'
        )
        @cloneEncounter()
      )
      @placeSquad Stage1BossPopup
      @setScenery('Skyline')
      @parallel(
        @attackWaves(
          @sequence(
            @placeSquad ScraperFlyer,
              amount: 6
              delay: 500
            @placeSquad ScraperFlyer,
              amount: 8
              delay: 500
          )
          drop: 'pool'
        )
        @sequence(
          @wait 3000
          @placeSquad Shooter,
            amount: 4
            delay: 750
            drop: 'pool'
            options:
              shootOnSight: yes
          @placeSquad HeliAttack,
            drop: 'pool'
        )
      )
    )

  highSkylineFighting: ->
    @sequence(
      @parallel(
        @placeSquad Stage1BossPopup
        @cloneEncounter()
      )

      @gainHeight(300, duration: 4000)
      @checkpoint @checkpointEndStage('Skyline', 500000)

      @parallel(
        @repeat 2, @cloneEncounter()
        @placeSquad HeliAttack,
          drop: 'pool'
          amount: 2
          delay: 5000
      )

      @async @showText 'Warning!', color: '#FF0000', mode: 'blink'
      @setScenery 'SkylineBase'
      @while(
        @wait 3000
        @waitingRocketStrike()
      )
      @placeSquad Stage1BossLeaving
      @say 'General', 'He is going to the military complex!\nBut we cant get through those shields now...', noise: 'low'
    )

  cloneEncounter: ->
    @attackWaves(
      @parallel(
        @sequence(
          @wait 4000
          @placeSquad PlayerClone,
            options:
              from: 'top'
        )
        @placeSquad PlayerClone,
          options:
            from: 'bottom'
      )
      drop: 'pool'
    )

  checkpointMidStage: (scenery, sunSkip) ->
    @sequence(
      @setScenery(scenery)
      @async @runScript(Morning, { speed: 1 })
      @wait 2000
    )

  checkpointEndStage: (scenery, sunSkip) ->
    @sequence(
      @setScenery(scenery)
      @sunRise(skipTo: sunSkip)
      @parallel(
        @if((-> @player(1).active), @drop(item: 'damage', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'damage', inFrontOf: @player(2)))
      )
      @wait 2000
      @parallel(
        @if((-> @player(1).active), @drop(item: 'rapid', inFrontOf: @player(1)))
        @if((-> @player(2).active), @drop(item: 'speed', inFrontOf: @player(2)))
      )
    )

  sunRise: (options = { skipTo: 0 }) ->
    @async @runScript(Noon, extend({ speed: 1 }, options))

  stalkerShootout: ->
    @parallel(
      @placeSquad Stalker,
        drop: 'pool'
      @attackWaves(
        @parallel(
          @placeSquad Shooter,
            amount: 8
            delay: 500
            options:
              shootOnSight: yes
          @placeSquad Swirler,
            amount: 8
            delay: 500
            options:
              shootOnSight: yes
        )
        drop: 'pool'
      )
    )

  waitingRocketStrike: ->
    @sequence(
      @placeSquad Stage1BossRocketStrike,
        amount: 6
        delay: 150
        options:
          gridConfig:
            x:
              start: 1.1
              steps: 1
              stepSize: 0.05
            y:
              start: 0.125
              steps: 12
              stepSize: 0.05
      @wait 200
    )


module.exports =
  default: Stage2
