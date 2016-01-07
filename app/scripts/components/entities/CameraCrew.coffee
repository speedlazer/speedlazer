 Crafty.c 'CameraCrew',
  init: ->
    @requires '2D, WebGL, Choreography, ViewportFixed, Collision, Hideable, cameraHelicopter, SpriteAnimation'
    @reel 'fly', 200, [[0, 0], [1, 0]]
    @attr(
      w: 60
      h: 25
    )
    @origin 'middle left'

  cameraCrew: ->
    @animate 'fly', -1
    @onHit 'BackgroundBullet', (e) ->
      return if Game.paused
      bullet = e[0].obj
      @trigger('Hit', this)
      bullet.destroy()
    this

