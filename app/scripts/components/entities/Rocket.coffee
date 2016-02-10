Crafty.c 'Rocket',
  init: ->
    @requires 'Enemy, standardRocket'

  rocket: (attr = {}) ->
    @attr _.defaults(attr,
      health: 300)
    @origin 'center'

    #options =
      #maxParticles: 150
      #size: 8
      #sizeRandom: 6
      #speed: 2
      #speedRandom: 0.5
      ## Lifespan in frames
      #lifeSpan: 16
      #lifeSpanRandom: 4
      ## Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
      #angle: 90
      #angleRandom: 10
      #startColour: [235, 135, 5, 1]
      #startColourRandom: [28, 150, 45, 0.2]
      #endColour: [135, 135, 135, 0]
      #endColourRandom: [60, 60, 60, 0.1]
      ## Only applies when fastMode is off, specifies how sharp the gradients are drawn
      #sharpness: 10
      #sharpnessRandom: 10
      ## Random spread from origin
      #spread: 2
      ## How many frames should this last
      #duration: -1
      ##duration: 400 / Crafty.timer.FPS()
      ## Will draw squares instead of circle gradients
      ##fastMode: false
      #fastMode: no
      #gravity: { x: 0, y: -0.12 }
      ## sensible values are 0-3
      #jitter: 0

    #@attach Crafty.e("2D,Particles").attr(
      #x: @x + @w
      #y: @y + 3
    #).particles(options)

    @enemy()
    this

