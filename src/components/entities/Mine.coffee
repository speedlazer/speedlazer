defaults = require('lodash/defaults')

Crafty.c 'Mine',
  init: ->
    @requires 'Enemy, standardMine, SpriteAnimation'
    @reel 'open', 200, [[4, 3], [5, 3]]
    @reel 'close', 200, [[4, 3], [3, 3]]
    @reel 'blink', 100, [[5, 3], [6, 3]]

    @bind 'GameLoop', (fd) ->
      delta = (360 / 4000) * fd.dt
      @attr rotation: @rotation + delta

  mine: (attr = {}) ->
    @crop 4, 4, 25, 25
    @attr defaults(
      attr,
      h: 25,
      w: 25,
      health: 100
      weaponOrigin: [12, 12]
    )
    @origin 'center'

    @enemy()
    this

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    @vx = dx * (1000 / dt)
    @vy = dy * (1000 / dt)
