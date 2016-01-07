Crafty.c 'Bullet',
  init: ->
    @requires '2D, WebGL, Color, Collision'
    @color '#FFFF00'

  fire: (properties) ->
    @attr(damage: properties.damage).bind('GameLoop', (fd) =>
      dist = fd.dt * (properties.speed / 1000)

      @x += Math.cos(properties.direction / 180 * Math.PI) * dist
      @y += Math.sin(properties.direction / 180 * Math.PI) * dist

      if @x > @_maxXforViewPort()
        # Maybe send a bullet miss event
        @destroy()
    ).onHit 'Solid', ->
      return if Game.paused
      @destroy()
    this

  _maxXforViewPort: ->
    maxX = -Crafty.viewport._x + Crafty.viewport._width / Crafty.viewport._scale
    maxX + 10
