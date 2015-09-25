
Game = @Game
Game.EnemyFormation ?= {}

class Game.EnemyFormation.FlyOver extends Game.EventHandler

  constructor: (@level, @enemyConstructor, @callback) ->
    super
    @enemiesToSpawn = 4
    @enemiesSpawned = 0
    @enemiesDestroyed = 0
    @startRandom = 50 + Math.round(Math.random() * 200)

    # Duration is needed to know how long this attack needs
    @duration = 400 + 500 + 1900 + 4000 + 100 + 1 + 1500

    Crafty.e('Delay').delay(
      =>
        e = @enemyConstructor(@enemiesSpawned)

        c = [
          length: 1
          x: 600
          y: @startRandom
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
          y = 50 + (Math.floor(@enemiesSpawned / 2) * 100) + Math.round(Math.random() * 50)
          c.push
            length: 1
            x: 600
            y: y
            duration: durations[@enemiesSpawned]
            type: 'viewport'
          c.push
            length: 1
            x: 20
            y: y
            maxSpeed: 2
            duration: 4000
            type: 'viewport'
            event: 'Shoot'
        else
          y = 350 - (Math.floor(@enemiesSpawned / 2) * 100) + Math.round(Math.random() * 50)
          c.push
            length: 1
            x: 600
            y: y
            duration: durations[@enemiesSpawned]
            type: 'viewport'
          c.push
            length: 1
            x: 20
            y: y
            maxSpeed: 2
            duration: 4000
            type: 'viewport'
            event: 'Shoot'

        c.push
          type: 'linear'
          duration: 100
          x: -100
        c.push
          type: 'delay'
          duration: 1
          event: 'Survived'

        e.bind 'Survived', =>
          @handle('Survived', e)
        e.bind 'Destroyed', =>
          @enemiesDestroyed += 1
          @handle('Destroyed', e)
          if @enemiesDestroyed is @enemiesToSpawn
            @handle('LastDestroyed', e)

        @level.addComponent(e, x: 750, y: @startRandom)
        @enemiesSpawned += 1

        e.choreography(c, 0)
    , 500, 3)
