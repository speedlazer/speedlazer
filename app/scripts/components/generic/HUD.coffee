
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
    @hudFloat = Crafty.bind 'ViewportMove', (coords) =>
      @attr
        x: @viewportX + coords.x
        y: @viewportY + coords.y
    this

  remove: ->
    Crafty.unbind 'GameLoop', @hudFloat

