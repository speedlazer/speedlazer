Crafty.c 'LargeDrone',
  init: ->
    @requires 'Color, Enemy'

  drone: (attr = {}) ->
    @attr _.defaults(attr,
      w: 45, h: 35, health: 800)
    @origin 'center'
    @color '#0000DF'

    @enemy()
    this
