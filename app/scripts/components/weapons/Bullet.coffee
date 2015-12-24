Crafty.c 'Bullet',
  init: ->
    @requires '2D, WebGL, Color, Collision'
    @color '#FFFF00'

  fire: (properties) ->
    @attr(damage: properties.damage).bind('EnterFrame', (fd) =>
      @x += (properties.speed / 1000.0) * fd.dt
      if @x > @_maxXforViewPort()
        # Maybe send a bullet miss event
        @destroy()
    ).onHit 'Solid', ->
      @destroy()
    this

  _maxXforViewPort: ->
    maxX = -Crafty.viewport._x + Crafty.viewport._width / Crafty.viewport._scale
    maxX + 10
