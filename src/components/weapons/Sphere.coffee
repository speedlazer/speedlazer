Crafty.c 'Sphere',
  init: ->
    @requires '2D, WebGL, sphere1, SpriteAnimation, Collision'
    @crop 0, 0, 17, 17
    @collision [5, 5, 12, 5, 12, 12, 5, 12]
    @attr(
      w: 18
      h: 18
      speed: 300
    )
    @reel 'blink', 150, [[7, 3, 1, 1], [8, 3, 1, 1]]

  blink: ->
    @animate 'blink', -1
    this

  muzzle: ->
    @sprite 8, 3
    this
