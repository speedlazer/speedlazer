defaults = require('lodash/defaults')

Crafty.c 'Debris',
  init: ->
    @requires 'Enemy, WebGL, debris1'

    @bind 'GameLoop', (fd) ->
      delta = (360 / 4000) * fd.dt
      @attr rotation: @rotation + delta

  debris: (attr = {}) ->
    @crop 1, 1, 126, 126
    @attr defaults(attr,
      w: 100
      h: 100
      health: 800
      defaultSpeed: 100
    )
    @origin 'center'

    @enemy()
    this

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    @vx = dx * (1000 / dt)
    @vy = dy * (1000 / dt)

