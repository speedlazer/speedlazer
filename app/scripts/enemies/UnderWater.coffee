
Game = @Game
Game.EnemyFormation ?= {}

class Game.EnemyFormation.UnderWater extends Game.EventHandler

  constructor: (@level, @enemyConstructor, @callback) ->
    super
    @offset = @level.getComponentOffset()

    waterSpot = Crafty.e('2D, Canvas, Color, Choreography')
      .color('#000040')
      .attr({ z: -1, w: 50, h: 30, alpha: 0.5 })

    ships = Crafty('PlayerControlledShip')
    target = ships.get Math.floor(Math.random() * ships.length)

    @level.addComponent(
      waterSpot,
      x: 700, y: @level.visibleHeight - 20,
      @offset
    )
    ec = [
      type: 'linear'
      y: -500
      x: 50
      duration: 1000
    ]

    c = [
      type: 'follow'
      axis: 'x'
      maxSpeed: 4
      target: target
      duration: 3000
    ,
      type: 'tween'
      event: 'matchSpeed'
      properties:
        w: 40
        h: 20
        alpha: 1.0
      duration: 500
    ,
      type: 'tween'
      properties:
        w: 50
        h: 80
        y: waterSpot.y - 40
        alpha: 0.2
      event: 'splash'
      duration: 500
    ,
      type: 'tween'
      properties:
        w: 50
        h: 20
        y: waterSpot.y - 20
        alpha: 0.0
      duration: 200
    ]

    waterSpot.choreography(c)
      .bind 'matchSpeed', =>
        waterSpot.bind 'EnterFrame', ->
          @x += target._forcedSpeed.x

      .bind 'splash', =>
        waterSpot.color('#FFFFFF').attr(z: 1)

        e = @enemyConstructor(@enemiesSpawned)
        e.bind 'Survived', =>
          @handle('Survived', e)
        e.bind 'Destroyed', =>
          @handle('Destroyed', e)
          @handle('LastDestroyed', e)
        @level.addComponent(e, x: waterSpot.x + (waterSpot.w // 2) - (e.w // 2), y: waterSpot.y, { x: 0, y: 0 })
        e.addComponent('Choreography').choreography ec

      .bind 'ChoreographyEnd', ->
        waterSpot.destroy()


