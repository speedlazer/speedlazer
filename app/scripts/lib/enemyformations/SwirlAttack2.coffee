
Game = @Game
Game.EnemyFormation ?= {}

class Game.EnemyFormation.SwirlAttack2 extends Game.EventHandler

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
          rotation: yes
          path: [
              x: 0.96875
              y: 0.7291666666666666
            ,
              x: 0.46875
              y: 0.6916666666666667
            ,
              x: 0.15
              y: 0.3625
            ,
              x: 0.315625
              y: 0.08333333333333333
            ,
              x: 0.678125
              y: 0.225
            ,
              x: 0.240625
              y: 0.725
            ,
              x: 0.021875
              y: 0.6083333333333333
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
        @level.addComponent(e, x: 750, y: 400, @offset)
        @enemiesSpawned += 1

        e.choreography(c)
    , 500, @enemiesToSpawn - 1)
