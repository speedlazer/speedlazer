Crafty.c 'Sphere',
  init: ->
    @requires '2D, WebGL, sphere1, SpriteAnimation'
    @crop 5, 4, 7, 7
    @attr(
      w: 7
      h: 7
      speed: 300
    )
    @reel 'blink', 150, [[7, 3, 1, 1], [8, 3, 1, 1]]

  blink: ->
    @animate 'blink', -1
    this

  muzzle: ->
    @sprite 8, 3
    this
