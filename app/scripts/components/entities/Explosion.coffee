Crafty.c 'Explosion',
  init: ->
    @requires '2D,Tween,Delay'

    @explosionMode = window.Game.explosionMode
    if @explosionMode is 'block'
      @requires 'WebGL, Color'

  explode: (attr) ->
    radius = attr.radius ? 20
    @attr attr

    options =
      maxParticles: 6 * attr.radius
      size: attr.radius
      sizeRandom: 8
      speed: (attr.radius / 13)
      speedRandom: 0.5
      # Lifespan in frames
      lifeSpan: 19
      lifeSpanRandom: 7
      # Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
      angle: 0
      angleRandom: 360
      startColour: [235, 135, 5, 1]
      startColourRandom: [28, 150, 45, 0.2]
      endColour: [135, 135, 135, 0]
      endColourRandom: [60, 60, 60, 0.1]
      # Only applies when fastMode is off, specifies how sharp the gradients are drawn
      sharpness: 10
      sharpnessRandom: 10
      # Random spread from origin
      spread: attr.radius / 2
      # How many frames should this last
      duration: 400 / Crafty.timer.FPS()
      #duration: -1
      # Will draw squares instead of circle gradients
      #fastMode: false
      fastMode: no
      gravity: { x: 0, y: 0 }
      # sensible values are 0-3
      jitter: 0

    @attr
      w: 1
      h: 1

    if @explosionMode is 'block'
      @color '#FF0000'
    @tween({
      x: @x - radius
      y: @y - radius
      w: @w + (radius * 2)
      h: @h + (radius * 2)
      alpha: 0.2
    }, 500)
    @bind 'TweenEnd', ->
      @destroy()

    if @explosionMode is 'particles'
      options.fastMode = yes

    if @explosionMode isnt 'block'
      cleanupDelay = (options.lifeSpan + options.lifeSpanRandom) * Crafty.timer.FPS()
      Crafty.e("2D,Particles,Delay").attr(
        x: @x - (attr.radius / 2)
        y: @y - (attr.radius / 2)
      ).particles(options).bind 'ParticleEnd', ->
        # Particleend means the duration is passed.
        # This stops new particles from emiting.
        # But the particles are still alive for their lifetime
        @delay((-> @destroy()), cleanupDelay)

    this
