
Crafty.c 'HUD',
  init: ->
    @requires '2D'

  positionHud: ({ x, y, z }) ->
    @attr
      viewportX: x
      viewportY: y
      viewportZ: z
      x: x - Crafty.viewport.x
      y: y - Crafty.viewport.y
      z: z
    @hudFloat = Crafty.bind 'EnterFrame', =>
      @attr
        x: @viewportX - Crafty.viewport.x
        y: @viewportY - Crafty.viewport.y
    this

  remove: ->
    Crafty.unbind 'EnterFrame', @hudFloat

