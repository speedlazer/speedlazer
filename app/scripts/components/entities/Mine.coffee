Crafty.c 'Mine',
  init: ->
    @requires 'Enemy, Color'

  mine: (attr = {}) ->
    @attr _.defaults(attr,
      w: 25, h: 25, health: 200)
    @origin 'center'
    @color '#111111'

    @enemy()
    this
