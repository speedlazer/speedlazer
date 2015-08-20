
Game = @Game
Game.EnemyFormation ?= {}

class Game.EnemyFormation.Splash extends Game.EventHandler

  constructor: (@level, @enemyConstructor, @callback) ->
    super
    @enemiesSpawned = 0
    @enemiesDestroyed = 0
    Crafty.e('Delay').delay(
      =>
        e = @enemyConstructor(@enemiesSpawned)

        c = [
          length: 1
          x: 600
          y: 200
          duration: 100
          type: 'viewport'
        ,
          repeat: 2
          x: -100
          y: 30
          duration: 4500
          type: 'sine'
        ]

        e.bind 'Destroyed', =>
          @enemiesDestroyed += 1
          @handle('Destroyed', e)
          if @enemiesDestroyed is @enemiesSpawned
            @handle('LastDestroyed', e)

        @level.addComponent(e, x: 750, y: 150)
        @enemiesSpawned += 1

        e.choreography(c, 0)
    , 500, 3)
