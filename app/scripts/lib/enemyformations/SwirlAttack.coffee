
Game = @Game
Game.EnemyFormation ?= {}

class Game.EnemyFormation.SwirlAttack extends Game.EventHandler

  constructor: (@level, @enemyConstructor, @callback) ->
    super
    @enemiesToSpawn = 4
    @enemiesSpawned = 0
    @enemiesDestroyed = 0
    @offset = @level.getComponentOffset()
    @duration = 10000 + ((@enemiesToSpawn - 2) * 500)

    Crafty.e('Delay').delay(
      =>
        c = [
          type: 'bezier'
          rotation: no
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
              y: 0.9425
          ]

          duration: 10000
        ]
        e = @enemyConstructor(@enemiesSpawned)

        e.bind 'Survived', =>
          @handle('Survived', e)
        e.bind 'Destroyed', =>
          @enemiesDestroyed += 1
          @handle('Destroyed', e)
          if @enemiesDestroyed is @enemiesToSpawn
            @handle('LastDestroyed', e)
        @level.addComponent(e, x: 750, y: -20, @offset)
        @enemiesSpawned += 1

        e.choreography(c)
    , 500, @enemiesToSpawn - 1)
