 Crafty.c 'CameraCrew',
  init: ->
    @requires '2D, WebGL, Choreography, ViewportFixed, Collision, Hideable, cameraHelicopter, SpriteAnimation, Flipable'
    @reel 'fly', 200, [[0, 6, 4, 2], [4, 6, 4, 2]]
    @crop 0, 0, 120, 50
    @attr(
      w: 60
      h: 25
    )
    @origin 'center'

  cameraCrew: ->
    @animate 'fly', -1
    @onHit 'BackgroundBullet', (e) ->
      return if Game.paused
      bullet = e[0].obj
      @trigger('Hit', this)
      bullet.destroy()
    this

