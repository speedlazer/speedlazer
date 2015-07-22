Crafty.c 'ScrollWall',
  init: ->
    screenHeight = 480
    @requires('2D, Canvas, Color, Edge, Collision')
    @attr
      x: 0
      y: 0
      w: 2
      h: screenHeight
      speed:
        x: 0
        y: 0

    @_speed = { x: 0, y: 0 }
    @wallEnd = Crafty.e('2D, Canvas, Color, ScrollFront')
      .attr(x: - (Crafty.viewport.x - Crafty.viewport.width) - 3, y: 0, h: screenHeight, w: 2)

    @bind 'Remove', ->
      @wallEnd.destroy()

    @bind 'EnterFrame', ->
      speedX = @_speed.x
      speedY = @_speed.y

      # When the ships are in the first 30% of the screen,
      # speed up the camera.
      Crafty('PlayerControlledShip').each ->
        margin = Crafty.viewport.width / 3.0
        if @x >  (- (Crafty.viewport.x - Crafty.viewport.width)) - margin
          perc = (speedX + 2) / speedX
          speedX += 2
          speedY *= perc

      @x += speedX
      @wallEnd.x += speedX
      @y += speedY
      @wallEnd.y += speedY

      Crafty.viewport.scroll('_y', -@y)
      Crafty.viewport.scroll('_x', -@x)
      #Crafty.viewport._clamp() # TODO: Figure out what this does and if we need it

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
      @_speed.y = 0
    this

  off: ->
    @unbind('EnterFrame')

