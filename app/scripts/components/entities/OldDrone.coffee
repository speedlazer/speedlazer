Crafty.c 'OldDrone',
  init: ->
    @requires 'Enemy, Color, ViewportFixed'

  drone: (attr = {}) ->
    @color '#0000FF'
    @attr _.defaults(attr,
      w: 40, h: 40, health: 200)
    @origin 'center'
    @attr weaponOrigin: [2, 25]

    @enemy().fixViewport()

