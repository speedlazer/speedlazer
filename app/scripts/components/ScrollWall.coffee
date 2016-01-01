Crafty.c 'ScrollWall',
  init: ->
    @requires('2D, Edge, Collision')
    @attr
      x: 0
      y: 0
      w: 2
      h: Crafty.viewport.height
      speed:
        x: 0
        y: 0

    @_speed = { x: 0, y: 0 }
    @wallEnd = Crafty.e('2D, ScrollFront, Edge')
      .attr(x: - (Crafty.viewport.x - Crafty.viewport.width) - 3, y: 0, h: Crafty.viewport.height, w: 12)
    @attach @wallEnd

    @wallTop = Crafty.e('2D, Edge, Collision')
      .attr(x: 0, y: 40, h: 2, w: Crafty.viewport.width)
    @attach @wallTop

    @wallBottom = Crafty.e('2D, Edge, Collision')
      .attr(x: 0, y: Crafty.viewport.height - 2, h: 2, w: Crafty.viewport.width)
    @attach @wallBottom

    @bind 'GameLoop', (fd) ->
      speedX = @_speed.x
      speedY = @_speed.y

      if @allowPushing
        # When the ships are in the first 30% of the screen,
        # speed up the camera.
        Crafty('PlayerControlledShip').each ->
          threshold = Crafty.viewport.width * (2.0 / 3.0)
          relOffset = @x + Crafty.viewport.x
          if relOffset > threshold
            percentageOutOfBounds = (relOffset - threshold) / (Crafty.viewport.width - threshold)
            increase = (5 + @_forcedSpeed.x) * percentageOutOfBounds

            if speedX > 0 # Prevend division by zero
              percentage = (speedX + increase) / speedX
              speedY *= percentage

            speedX += increase

      # the speed is px / sec
      # the time passed is fd.dt in milliseconds
      @x += (speedX / 1000.0) * fd.dt
      @y += (speedY / 1000.0) * fd.dt

      Crafty.viewport.y = -@y if Crafty.viewport.y isnt -@y
      Crafty.viewport.x = -@x if Crafty.viewport.x isnt -@x

    # TODO: Verify correctness of these statements
    #@onHit 'PlayerControlledShip', (el) ->
      ## Push the player forward
      #for e in el
        #p = e.obj
        #p.attr x: p.x + @_speed.x

    #@wallTop.onHit 'PlayerControlledShip', (el) =>
      ## Push the player downward
      #for e in el
        #p = e.obj
        #p.attr y: p.y + @_speed.y

    #@wallBottom.onHit 'PlayerControlledShip', (el) =>
      ## Push the player upward
      #for e in el
        #p = e.obj
        #p.attr y: @wallBottom.y - p.h

  scrollWall: (speed) ->
    if speed.x? && speed.y?
      @_speed.x = speed.x
      @_speed.y = speed.y
    else
      @_speed.x = speed
      @_speed.y = 0
    this

  setAllowPushing: (@allowPushing) ->

  off: ->
    @wallEnd.removeComponent('Edge')
    @unbind('GameLoop')

  remove: ->
    @unbind('GameLoop')

