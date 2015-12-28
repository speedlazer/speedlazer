 Crafty.c 'CameraCrew',
  init: ->
    @requires '2D, WebGL, Color, Choreography, ViewportFixed, Collision, Hideable'
    @attr(
      w: 60
      h: 40
    ).color '#404050'
    @origin 'middle left'

  cameraCrew: ->
    @onHit 'BackgroundBullet', (e) ->
      bullet = e[0].obj
      @trigger('Hit', this)
      bullet.destroy()
    this

