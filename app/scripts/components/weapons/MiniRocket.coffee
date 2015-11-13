Crafty.c 'MiniRocket',
  init: ->
    @requires '2D, Canvas, Color, Collision'
    @color '#FF0000'

  fire: (attr = {}) ->
    @attr _.defaults(attr,
      w: 35, h: 10)
    @bind('EnterFrame', (fd) =>
      @x += (@speed / 1000.0) * fd.dt
      if @x > @_maxXforViewPort()
        # Maybe send a bullet miss event
        @destroy()
    ).onHit 'Solid', @_impact
    .onHit 'Enemy', @_impact

    options =
      maxParticles: 100
      size: 5
      sizeRandom: 4
      speed: 2
      speedRandom: 0.25
      # Lifespan in frames
      lifeSpan: 13
      lifeSpanRandom: 5
      # Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
      angle: -90
      angleRandom: 10
      startColour: [235, 135, 5, 1]
      startColourRandom: [28, 150, 45, 0.2]
      endColour: [135, 135, 135, 0]
      endColourRandom: [60, 60, 60, 0.1]
      # Only applies when fastMode is off, specifies how sharp the gradients are drawn
      sharpness: 10
      sharpnessRandom: 10
      # Random spread from origin
      spread: 3
      # How many frames should this last
      duration: -1
      #duration: 400 / Crafty.timer.FPS()
      # Will draw squares instead of circle gradients
      #fastMode: false
      fastMode: yes
      gravity: { x: 0, y: -0.12 }
      # sensible values are 0-3
      jitter: 0

    @attach Crafty.e("2D,Canvas,Particles").attr(
      x: @x
      y: @y
    ).particles(options)

    this

  _impact: ->
    Crafty.e('Explosion').explode
      x: @x + @w
      y: @y + (@h / 2)
      radius: @radius
      damage: @damage
    @destroy()

  _maxXforViewPort: ->
    maxX = -Crafty.viewport._x + Crafty.viewport._width / Crafty.viewport._scale
    maxX + 700
