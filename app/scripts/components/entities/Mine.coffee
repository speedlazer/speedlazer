Crafty.c 'Mine',
  init: ->
    @requires 'Color, Enemy'

  drone: (attr = {}) ->
    @attr _.defaults(attr,
      w: 25, h: 25, health: 200)
    @origin 'center'
    @color '#999999'

    @enemy()
    this
