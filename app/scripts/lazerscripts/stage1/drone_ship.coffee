Game = @Game
Game.Scripts ||= {}

class Game.Scripts.DroneShip extends Game.EntityScript

  spawn: (options) ->
    Crafty.e('DroneShip').attr(
      x: Crafty.viewport.width + 180
      y: 450
      defaultSpeed: options.speed ? 200
    ).setSealevel(@level.visibleHeight + 10)

  execute: ->
    @sequence(
      @moveTo(x: 0.2)
      => @entity.open()
      @wait(1000)
      @parallel(
        @placeSquad Game.Scripts.ShipDrone,
          amount: 5,
          drop: 'pool'
          delay: 500
          options:
            shootOnSight: yes
        @sequence(
          @wait(3000)
          => @entity.close()
          @moveTo(x: -0.5)
        )
      )
    )

