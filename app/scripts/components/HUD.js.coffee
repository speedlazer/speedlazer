
Crafty.c 'HUD',
  init: ->
    @requires('2D')

  positionHud: ({ x, y, z }) ->
    @attr
      viewportX: x
      viewportY: y
      viewportZ: z
      x: x - Crafty.viewport._x
      y: y - Crafty.viewport._y
      z: z
    @hudFloat = Crafty.bind 'ViewportScroll', =>
      @attr
        x: @viewportX - Crafty.viewport._x
        y: @viewportY - Crafty.viewport._y
    this

  remove: ->
    Crafty.unbind 'ViewportScroll', @hudFloat

