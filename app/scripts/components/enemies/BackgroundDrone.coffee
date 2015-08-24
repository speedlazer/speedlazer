Crafty.c 'BackgroundDrone',
  init: ->
    @requires '2D, Canvas, Color, Collision, Choreography'

  drone: ->
    @attr w: 15, h: 15, z: -1
    @color '#2020FF'

    this
