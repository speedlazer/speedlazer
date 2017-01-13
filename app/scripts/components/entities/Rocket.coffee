Crafty.c 'Rocket',
  init: ->
    @requires 'Enemy, standardRocket, ViewportFixed'

  rocket: (attr = {}) ->
    @crop(0, 0, 47, 17)
    @attr _.defaults(attr,
      health: 300)
    @origin 'center'

    @enemy().fixViewport()

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    @vx = dx * (1000 / dt)
    @vy = dy * (1000 / dt)

    @rotation = rotation if rotation?

