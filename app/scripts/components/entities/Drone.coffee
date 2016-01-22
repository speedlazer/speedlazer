Crafty.c 'Drone',
  init: ->
    @requires 'Enemy, standardDrone'

  drone: (attr = {}) ->
    @attr _.defaults(attr,
      w: 40, h: 40, health: 300)
    @origin 'center'
    @collision [2, 25, 8,18, 20,13, 30, 15, 33, 28, 14, 34, 4, 30]
    @attr weaponOrigin: [2, 25]

    @enemy()
    this
