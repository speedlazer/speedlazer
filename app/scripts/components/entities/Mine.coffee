Crafty.c 'Mine',
  init: ->
    @requires 'Enemy, standardMine, SpriteAnimation'
    @reel 'open', 200, [[1, 3], [2, 3]]
    @reel 'close', 200, [[1, 3], [0, 3]]
    @reel 'blink', 100, [[2, 3], [3, 3]]

    @bind 'GameLoop', (fd) ->
      delta = (360 / 4000) * fd.dt
      @attr rotation: @rotation + delta

  mine: (attr = {}) ->
    @attr _.defaults(attr, h: 25, w: 25, health: 100)
    @origin 'center'

    @enemy()
    this

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    @vx = dx * (1000 / dt)
    @vy = dy * (1000 / dt)
