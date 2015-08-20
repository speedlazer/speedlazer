
Game = @Game
Game.EnemyFormation ?= {}

class Game.EnemyFormation.FlyOver extends Game.EventHandler

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
          duration: 400
          type: 'viewport'
        ]
        offset = 500
        durations = [
          offset + 1500        # 1
          offset + 1000 + 900  # 4
          offset + 500  + 300  # 2
          offset        + 600  # 3
        ]

        if @enemiesSpawned % 2 is 0
          c.push
            length: 1
            x: 600
            y: 50 + (Math.floor(@enemiesSpawned / 2) * 100)
            duration: durations[@enemiesSpawned]
            type: 'viewport'
          c.push
            length: 1
            x: 20
            y: 50 + (Math.floor(@enemiesSpawned / 2) * 100)
            maxSpeed: 2
            duration: 4000
            type: 'viewport'
        else
          c.push
            length: 1
            x: 600
            y: 350 - (Math.floor(@enemiesSpawned / 2) * 100)
            duration: durations[@enemiesSpawned]
            type: 'viewport'
          c.push
            length: 1
            x: 20
            y: 350 - (Math.floor(@enemiesSpawned / 2) * 100)
            maxSpeed: 2
            duration: 4000
            type: 'viewport'

        c.push
          type: 'delay'
          duration: 1
          event: 'Survived'

        e.bind 'Survived', =>
          @handle('Survived', e)
        e.bind 'Destroyed', =>
          @enemiesDestroyed += 1
          @handle('Destroyed', e)
          if @enemiesDestroyed is @enemiesSpawned
            @handle('LastDestroyed', e)

        @level.addComponent(e, x: 750, y: 150)
        @enemiesSpawned += 1

        e.choreography(c, 0)
    , 500, 3)
