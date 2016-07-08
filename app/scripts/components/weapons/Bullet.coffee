Crafty.c 'Bullet',
  init: ->
    @requires '2D, WebGL, Color, Collision'
    @color '#FFFF00'

  fire: (properties) ->
    @attr(
      damage: properties.damage
      speed: properties.speed
      rotation: properties.direction
      ship: properties.ship
    ).bind('GameLoop', (fd) =>
      dist = fd.dt * (@speed / 1000)

      @x += Math.cos(properties.direction / 180 * Math.PI) * dist
      @y += Math.sin(properties.direction / 180 * Math.PI) * dist

      if @x > @_maxXforViewPort()
        # Maybe send a bullet miss event
        @destroy()
      if @_minXforViewPort() > @x
        # Maybe send a bullet miss event
        @destroy()
      if @_minYforViewPort() > @y
        # Maybe send a bullet miss event
        @destroy()
      if @y > @_maxYforViewPort()
        # Maybe send a bullet miss event
        @destroy()
    ).onHit 'Solid', ->
      return if Game.paused
      @destroy()
    this

  _maxXforViewPort: ->
    maxX = -Crafty.viewport._x + Crafty.viewport._width / Crafty.viewport._scale
    maxX + 10

  _minXforViewPort: ->
    minX = -Crafty.viewport._x
    minX - 10

  _maxYforViewPort: ->
    maxY = -Crafty.viewport._y + Crafty.viewport._height / Crafty.viewport._scale
    maxY + 10

  _minYforViewPort: ->
    minY = -Crafty.viewport._y
    minY - 10
