{ Noise } = require('noisejs')

noise = new Noise(Math.random())

Crafty.c 'ScrollWall',
  init: ->
    @requires('2D, Edge, Collision, Acceleration')
    @trauma = 0
    @time = 0
    @attr
      x: 0
      y: 0
      w: 2
      h: Crafty.viewport.height
      speed:
        x: 0
        y: 0
      viewHeight: 0

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
      speedX = @_currentSpeed.x
      speedY = @_currentSpeed.y
      @updateAcceleration()

      # TODO: While this is currently not in use,
      # It would be awesome if the player could move the camera vertically. (If allowed)
      # Or horizontally (when allowed)
      # This could allow gameplay through mazes where the player has to find the way on their own
      #
      #if @allowPushing
        ## When the ships are in the first 30% of the screen,
        ## speed up the camera.
        #Crafty('PlayerControlledShip').each ->
          #threshold = Crafty.viewport.width * (2.0 / 3.0)
          #relOffset = @x + Crafty.viewport.x
          #if relOffset > threshold
            #percentageOutOfBounds = (relOffset - threshold) / (Crafty.viewport.width - threshold)
            #increase = (5 + @_forcedSpeed.x) * percentageOutOfBounds

            #if speedX > 0 # Prevend division by zero
              #percentage = (speedX + increase) / speedX
              #speedY *= percentage

            #speedX += increase

      # the speed is px / sec
      # the time passed is fd.dt in milliseconds

      screenshake = Math.pow(@trauma, 2)
      @trauma = Math.max(0, @trauma - (0.001 * fd.dt))
      x = 0
      y = 0
      if screenshake > 0
        MAX_X_OFFSET = 40
        MAX_Y_OFFSET = 30

        @time += fd.dt

        xn = noise.perlin2(0.1, @time / ((3 - @trauma) * 160))
        yn = noise.perlin2(@time / ((3 - @trauma) * 160), 0.3)
        x = 0 + Math.round(MAX_X_OFFSET * screenshake * xn)
        y = 0 + Math.round(MAX_Y_OFFSET * screenshake * yn)

      Crafty.viewport.x = x
      Crafty.viewport.y = y

      dx = (speedX / 1000.0) * fd.dt
      dy = (speedY / 1000.0) * fd.dt
      @viewHeight += dy

      Crafty.trigger('CameraMove',
        dx: dx
        dy: dy
      )

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

  addTrauma: (amount) ->
    @trauma = Math.min(1, @trauma + amount)

  scrollWall: (speed, options = {}) ->
    @targetSpeed(speed, options)

  setAllowPushing: (@allowPushing) ->

  off: ->
    @wallEnd.removeComponent('Edge')
    @unbind('GameLoop')

  remove: ->
    @unbind('GameLoop')

