Crafty.c 'Drone',
  init: ->
    @requires 'Enemy, Color'

  drone: (attr = {}) ->
    @attr _.defaults(attr,
      w: 25, h: 25, health: 300)
    @origin 'center'
    @color '#0000FF'

    @enemy()
    this
