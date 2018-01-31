Crafty.c 'Bullet',
  init: ->
    @requires '2D, WebGL, sphere1, Collision, ColorEffects'
    @crop 4, 19, 24, 11
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

  bullet: (properties) ->
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
      ship: properties.ship
    )
    @onHit 'BulletSolid', ->
      return if Game.paused
      @trigger('BulletWall', this)

    @bind('Freeze', ->
      @unbind('GameLoop', @_onGameLoop)
    )
    this

  fire: (properties) ->
    @xDir = Math.cos(properties.direction / 180 * Math.PI)
    @yDir = Math.sin(properties.direction / 180 * Math.PI)
    @attr(
      damage: properties.damage
      speed: properties.speed
      rotation: properties.direction
    )
    @uniqueBind('GameLoop', @_onGameLoop)
    this

  _onGameLoop: (fd) ->
    dist = fd.dt * (@speed / 1000)

    @shift(@xDir * dist, @yDir * dist)

    if (
      (@x > @_maxXforViewPort()) ||
      (@_minXforViewPort() > @x) ||
      (@_minYforViewPort() > @y) ||
      (@y > @_maxYforViewPort())
    )
      @trigger('BulletMiss', this)

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
