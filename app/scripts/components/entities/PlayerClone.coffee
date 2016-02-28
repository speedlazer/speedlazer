Crafty.c 'PlayerClone',
  init: ->
    @requires 'Enemy, playerShip'

  playerClone: (attr = {}) ->
    @attr _.defaults(attr, h: 45, w: 71, health: 900)
    @origin 'center'
    @flipX()
    @colorOverride '#808080', 'partial'

    @enemy()
    this

