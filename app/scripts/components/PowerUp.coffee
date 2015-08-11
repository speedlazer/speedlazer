Crafty.c 'PowerUp',
  init: ->
    @requires '2D,Canvas,Color'
    @color '#20FF20'
    @attr
      w: 20
      h: 20

  remove: ->

  powerUp: (@settings) ->
    this
