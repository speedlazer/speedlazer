
Game = @Game
Game.EnemyFormation ?= {}

class Game.EnemyFormation.Splash extends Game.EventHandler

  constructor: (@level, @enemyConstructor, @callback) ->
    super
    @enemiesSpawned = 0
    @enemiesDestroyed = 0
    @duration = 50 + 2500 + 1000 + 500 + 1100
    Crafty.e('Delay').delay(
      =>
        e = @enemyConstructor(@enemiesSpawned)

        c = [
          length: 1
          x: 660
          y: 300
          duration: 50
          type: 'viewport'
        ,
          start: 0.5
          repeat: 1
          x: -50
          y: 50
          duration: 2500
          type: 'sine'
        ,
          x: 0
          y: 85
          duration: 1000
          type: 'linear'
        ,
          type: 'delay'
          duration: 500
          event: 'splash'
        ]

        e.bind 'Destroyed', =>
          @enemiesDestroyed += 1
          @handle('Destroyed', e)
          if @enemiesDestroyed is @enemiesSpawned
            @handle('LastDestroyed', e)

        @level.addComponent(e, x: 750, y: 150)
        @enemiesSpawned += 1

        e.choreography(c, 0)
        e.one 'splash', ->
          @attr alpha: 0
          @trigger 'Destroyed', this
          splash = Crafty.e('2D, Tween, Canvas, Color').color('#E0E0E0').attr(
            z: -1
            w: 20
            h: 1
            alpha: 1
            x: @x
            y: @y + @h
          )
          splash.tween(
            alpha: 0
            w: 40
            x: splash.x - 5
            h: 30
            y: splash.y - 30,
            750
          ).one 'TweenEnd', ->
            @destroy()
    , 500, 3)
