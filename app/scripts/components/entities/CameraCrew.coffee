 Crafty.c 'CameraCrew',
  init: ->
    @requires '2D, WebGL, Choreography, ViewportFixed, Collision, Hideable, helicopter, SpriteAnimation, Flipable'
    @reel 'fly', 200, [[0, 6, 4, 2], [4, 6, 4, 2]]
    @crop 0, 9, 128, 55
    @attr(
      w: 60
      h: 25
    ).fixViewport()
    @origin 'center'

  cameraCrew: ->
    @animate 'fly', -1
    @onHit 'BackgroundBullet', (e) ->
      return if Game.paused
      @pauseAnimation()
      @sprite(8,6)
      bullet = e[0].obj
      @trigger('Hit', this)
      bullet.destroy()
    this

