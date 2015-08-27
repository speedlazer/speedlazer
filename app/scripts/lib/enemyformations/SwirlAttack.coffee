
Game = @Game
Game.EnemyFormation ?= {}

class Game.EnemyFormation.SwirlAttack extends Game.EventHandler

  constructor: (@level, @enemyConstructor, @callback) ->
    super
    @enemiesToSpawn = 4
    @enemiesSpawned = 0
    @enemiesDestroyed = 0
    Crafty.e('Delay').delay(
      =>
        c = [
          type: 'linear'
          x: -100
          y: 400
          duration: 1500
        ,
          type: 'sine'
          x: -300
          y: 200
          duration: 1500
          start: 0.5
          repeat: 0.25


        ]
        e = @enemyConstructor(@enemiesSpawned)


        @level.addComponent(e, x: 750, y: -20)
        @enemiesSpawned += 1

        e.choreography(c, 0)
    , 500, 3)
