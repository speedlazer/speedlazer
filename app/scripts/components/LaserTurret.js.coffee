
Crafty.c 'LaserTurret',
  init: ->
    @requires '2D, Canvas, Edge, Color'
    @attr w: 20, h: 20
    @beam = Crafty.e('2D, Canvas, Color, Collision')

  remove: ->

  laserTurret: (config) ->
    beamLength = 500

    laserStart = @y + @h
    laserEnd = @y + @h + beamLength

    down = config.orientation isnt 'up'

    unless down
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
    for object in @beam.hit('Edge')
      continue if object.obj is this
      if down
        collision = object.obj.y - laserStart
        if collision < laserEnd
          laserEnd = collision
      else
        collision = object.obj.y + object.obj.h
        if collision > laserStart
          laserStart = collision
          laserEnd = @y - collision

    @beam.attr h: laserEnd, y: laserStart

    this
