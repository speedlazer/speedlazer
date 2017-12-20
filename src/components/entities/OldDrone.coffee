defaults = require('lodash/defaults')

Crafty.c 'OldDrone',
  init: ->
    @requires 'Enemy, Color'

  drone: (attr = {}) ->
    @color '#0000FF'
    @attr defaults(attr,
      w: 40, h: 40, health: 200)
    @origin 'center'
    @attr weaponOrigin: [2, 25]

    @enemy()
    this

