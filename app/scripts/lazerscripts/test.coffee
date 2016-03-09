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
      @pickTarget('PlayerControlledShip')
      @placeSquad(Game.Scripts.JoeryMissile,
        amount: 4
        delay: 500
        options:
          location: @targetLocation(x: 1.3)
      )
    )



class Game.Scripts.JoeryMissile extends Game.EntityScript
  spawn: (options) ->
    options = _.defaults(options,
      pointsOHit: 125
      pointsOnDestroy: 50
    )

    return null unless options.location?

    location = options.location?()
    return null unless location

    @startLocation = [location.x, location.y]

    Crafty.e('Rocket').rocket(
      health: 250
      x: location.x - 30
      y: location.y - 8 + Math.round(Math.random() * 15)
      z: 0
      speed: 300
      pointsOnHit: options.pointsOnHit
      pointsOnDestroy: options.pointsOnDestroy
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence( 
      @pickTarget('PlayerControlledShip')
      
      @repeat @sequence(
        (sequence) =>
          previousPoint = @startLocation 
          point = @targetLocation()()
          @point = [point.x, point.y]
   
          r = @movePath([
            @point
          ], origin: previousPoint)(sequence)

          @startLocation = [
            Math.round(@entity.x + Crafty.viewport.x)
            Math.round(@entity.y + Crafty.viewport.y)
          ]

          r  
      )
    )

  onKilled: ->
    @bigExplosion()


