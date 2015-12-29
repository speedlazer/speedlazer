Crafty.c 'WaterSplash',
  init: ->
    @requires '2D,Particles,Delay'

    @explosionMode = window.Game.explosionMode
    if @explosionMode is 'block'
      @requires 'WebGL, Color, Tween'

  waterSplash: (attr) ->
    #console.log 'splash', attr.size
    options =
      maxParticles: 5 * attr.size
      size: attr.size / 1.5
      sizeRandom: 4
      speed: attr.size / 20
      speedRandom: 0.2
      # Lifespan in frames
      lifeSpan: attr.size / 3
      lifeSpanRandom: 7
      # Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
      angle: 350
      angleRandom: 20
      startColour: [40, 40, 170, 1]
      startColourRandom: [0, 0, 0, 0]
      endColour: [205, 205, 205, 0.1]
      endColourRandom: [30, 30, 30, 0.1]
      # Only applies when fastMode is off, specifies how sharp the gradients are drawn
      sharpness: 10
      sharpnessRandom: 5
      # Random spread from origin
      spread: attr.size / 3
      # How many frames should this last
      #duration: -1
      duration: 900 / Crafty.timer.FPS()
      # Will draw squares instead of circle gradients
      #fastMode: false,
      fastMode: no
      gravity: { x: 0, y: 0.25 }
      # sensible values are 0-3
      jitter: 0
    cleanupDelay = (options.lifeSpan + options.lifeSpanRandom) * Crafty.timer.FPS()

    if @explosionMode is 'particles'
      options.fastMode = yes

    if @explosionMode isnt 'block'
      @attr(
        x: attr.x
        y: attr.y
      ).particles(options).bind 'ParticleEnd', ->
        # Particleend means the duration is passed.
        # This stops new particles from emiting.
        # But the particles are still alive for their lifetime
        @delay((-> @destroy()), cleanupDelay)
    else
      radius = 60

      @attr(
        x: attr.x
        y: attr.y
        w: 30
        h: 0
      )
      @color '#FFFFFF'
      @tween({
        y: @y - radius
        h: @h + (radius)
        alpha: 0.2
      }, 500)
      @bind 'TweenEnd', ->
        @destroy()


    this
