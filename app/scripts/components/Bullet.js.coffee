
Crafty.c 'Bullet',
  init: ->
    @addComponent '2D, Canvas, Color, Collision'

  fire: (properties) ->
    @attr(damage: properties.damage).bind('EnterFrame', =>
      @_moveNextPosition(properties.speed)
      if @x > @_maxXforViewPort()
        # Maybe send a bullet miss event
        @destroy()
    ).onHit 'Edge', ->
      @destroy()
    this

  _moveNextPosition: (speed) ->
    @x = @x + speed
    
  _maxXforViewPort: ->
   maxX = -Crafty.viewport._x + Crafty.viewport._width / Crafty.viewport._scale
   maxX + 200
   maxX