defaults = require('lodash/defaults')

Crafty.c 'Debris',
  init: ->
    @requires 'Enemy, WebGL, Color'

    @bind 'GameLoop', (fd) ->
      delta = (360 / 4000) * fd.dt
      @attr rotation: @rotation + delta

  debris: (attr = {}) ->
    @attr defaults(attr,
      w: 100
      h: 100
      health: 800
      defaultSpeed: 100
    )
    @origin 'center'

    @color('#303030')
    @enemy()
    this

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    @vx = dx * (1000 / dt)
    @vy = dy * (1000 / dt)

