 Crafty.c 'CameraCrew',
  init: ->
    @requires '2D, WebGL, Choreography, ViewportFixed, Collision, Hideable, cameraHelicopter'
    @attr(
      w: 60
      h: 25
    )
    @origin 'middle left'

  cameraCrew: ->
    @onHit 'BackgroundBullet', (e) ->
      bullet = e[0].obj
      @trigger('Hit', this)
      bullet.destroy()
    this

