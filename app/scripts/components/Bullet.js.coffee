Crafty.c 'Bullet',
  init: ->
    @requires '2D, Canvas, Color, Collision'

  fire: (properties) ->
    @attr damage: properties.damage

    @bind 'EnterFrame', ->
      @x = @x + properties.speed

      maxX = (-Crafty.viewport._x + (Crafty.viewport._width / Crafty.viewport._scale))
      if (@x > maxX + 200)
        # Maybe send a bullet miss event
        @destroy()

    @onHit 'Edge', ->
      @destroy()

    this
