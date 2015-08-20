Crafty.c 'BackgroundDrone',
  init: ->
    @requires '2D, Canvas, Color, Collision, Choreography'

  drone: ->
    @attr w: 20, h: 20
    @color '#1010FF'

    this
