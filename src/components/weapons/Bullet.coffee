Crafty.c 'Bullet',
  init: ->
    @requires '2D, WebGL, sphere1, Collision, ColorEffects'
    @crop 6, 21, 18, 7
    @collision [
      0, 0,
      18, 0,
      18, 7,
      0, 7
    ]

  updateCollision: (w, h) ->
    @collision [
      0, 0,
      w, 0,
      w, h,
      0, h
    ]
    this

  fire: (properties) ->
    c = {}
    basicC = {
      _red: 255
      _green: 255
      _blue: 255
    }
    Crafty.assignColor(properties.ship.playerColor, c)
    for comp in ['_red', '_green', '_blue']
      newC = (c[comp] + basicC[comp] + basicC[comp]) / 3
      c[comp] = newC

    @colorOverride(c)
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
