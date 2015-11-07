Crafty.c 'Rocket',
  init: ->
    @requires 'Color, Enemy'

  rocket: (attr = {}) ->
    @attr _.defaults(attr,
      w: 45, h: 15, health: 300)
    @origin 'center'
    @color '#F00000'

    options =
      maxParticles: 150
      size: 10
      sizeRandom: 8
      speed: 3
      speedRandom: 0.5
      # Lifespan in frames
      lifeSpan: 19
      lifeSpanRandom: 7
      # Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
      angle: 90
      angleRandom: 10
      startColour: [235, 135, 5, 1]
      startColourRandom: [28, 150, 45, 0.2]
      endColour: [135, 135, 135, 0]
      endColourRandom: [60, 60, 60, 0.1]
      # Only applies when fastMode is off, specifies how sharp the gradients are drawn
      sharpness: 10
      sharpnessRandom: 10
      # Random spread from origin
      spread: 5
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
      x: @x + @w - Crafty.viewport.x
      y: @y - Crafty.viewport.y
    ).particles(options)

    @enemy()
    this

