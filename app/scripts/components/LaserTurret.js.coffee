
Crafty.c 'LaserTurret',
  init: ->
    @requires '2D, Canvas, Edge, Color'
    @attr w: 20, h: 20
    @beam = Crafty.e('2D, Canvas, Color')

  remove: ->

  laserTurret: (config) ->
    beamLength = 500

    laserStart = @y + @h
    laserEnd = @y + @h + beamLength

    if config.orientation is 'up'
      @attr y: @y - @h
      laserStart = @y - beamLength
      laserEnd = beamLength

    @beam
      .color('#FF00FF')
      .attr(
        x: @x + 5
        y: laserStart
        w: 10
        h: laserEnd
      )


    this
