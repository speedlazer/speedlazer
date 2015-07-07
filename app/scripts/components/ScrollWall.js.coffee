Crafty.c 'ScrollWall',
  init: ->
    @requires('2D, Canvas, Color, Edge, Collision')
    @attr
      x: 0
      y: 50
      w: 2
      h: 710
      speed:
        x: 0
        y: 0

    @_speed = { x: 0, y: 0 }
    @wallEnd = Crafty.e('2D, Canvas, Color, ScrollFront')
      .attr(x: - (Crafty.viewport.x - Crafty.viewport.width) - 3, y: 40, h: 710, w: 2)

    @bind 'Remove', ->
      @wallEnd.destroy()

    @bind 'EnterFrame', ->
      speedX = @_speed.x

      # When the ships are in the first 30% of the screen,
      # speed up the camera.
      Crafty('PlayerControlledShip').each ->
        margin = Crafty.viewport.width / 3.0
        if @x >  (- (Crafty.viewport.x - Crafty.viewport.width)) - margin
          speedX += 2

      @x += speedX
      @wallEnd.x += speedX
      Crafty.viewport.scroll('_x', -@x)
      Crafty.viewport._clamp()

    @onHit 'PlayerControlledShip', (el) ->
      # Push the player forward
      for e in el
        p = e.obj
        p.attr x: p.x + @_speed.x

  scrollWall: (speed) ->
    if speed.x? && speed.y?
      @_speed.x = speed.x
      @_speed.y = speed.y
    else
      @_speed.x = speed
      @_speed.y = speed
    this

  off: ->
    @unbind('EnterFrame')

