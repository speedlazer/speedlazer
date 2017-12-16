class Game.Scripts.MineWall extends Game.EntityScript

  spawn: (options) ->
    @startX = if options.direction is 'left' then -80 else 680
    @screenX = if options.direction is 'left' then 20 else 620
    @wallX = if options.direction is 'left' then 100 else 540

    @wallTarget = options.grid.getLocation()
    Crafty.e('Mine').mine(
      x: @startX
      y: 240
      defaultSpeed: 200
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @movePath [
        [@screenX, 240]
        [@wallX, @wallTarget.y]
      ], rotate: no, speed: 600
      @synchronizeOn 'placed'
      @pickTarget('PlayerControlledShip')
      @repeat @seekAndDestroy()
    )

  seekAndDestroy: ->
    @moveTo @targetLocation()

  onKilled: ->
    @blast(@location(), damage: 300, radius: 40)



