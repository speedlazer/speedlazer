Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Test extends Game.LazerScript
  assets: ->
    @loadAssets('shadow', 'explosion', 'playerShip')

  execute: ->
    @sequence(
      @setScenery 'Bay'
      @async @runScript(Game.Scripts.SunRise, skipTo: 0, speed: 12)
      @setSpeed 50
      @wait 1000
      @parallel(
        @placeSquad Game.Scripts.Swirler,
          amount: 4
          delay: 500
          drop: 'xp'

        @sequence(
          @wait 13000
          @screenShake(10, duration: 3000)
          @wait 3000
          @screenShake(10, duration: 3000)
        )
      )
    )

