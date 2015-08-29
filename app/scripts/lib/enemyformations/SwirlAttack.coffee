
Game = @Game
Game.EnemyFormation ?= {}

class Game.EnemyFormation.SwirlAttack extends Game.EventHandler

  constructor: (@level, @enemyConstructor, @callback) ->
    super
    @enemiesToSpawn = 8
    @enemiesSpawned = 0
    @enemiesDestroyed = 0
    @offset = @level.getComponentOffset()

    Crafty.e('Delay').delay(
      =>
        c = [
          type: 'bezier'
          path: [
              x: 0.946875
              y: 0.05
            ,
              x: 0.775
              y: 0.5583333333333333
            ,
              x: 0.39375
              y: 0.7625
            ,
              x: 0.071875
              y: 0.4041666666666667
            ,
              x: 0.365625
              y: 0.08333333333333333
            ,
              x: 0.628125
              y: 0.38333333333333336
            ,
              x: 0.2375
              y: 0.8583333333333333
            ,
              x: -0.0125
              y: 0.9625
          ]

          duration: 5500
        ]
        e = @enemyConstructor(@enemiesSpawned)

        @level.addComponent(e, x: 750, y: -20, @offset)
        @enemiesSpawned += 1

        e.choreography(c, 0)
    , 250, @enemiesToSpawn - 1)
