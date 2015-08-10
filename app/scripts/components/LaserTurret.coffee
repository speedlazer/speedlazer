
Crafty.c 'LaserTurret',
  init: ->
    @requires '2D, Canvas, Edge, Color, Tween, Delay'
    @attr w: 20, h: 20

    @detectionBeam = Crafty.e('2D, Collision').attr
      x: 5
      w: 10
    @attach @detectionBeam

    @beam = Crafty.e('2D, Canvas, Color, LaserBeam').attr
      x: 5
      w: 10
    .color '#FF00FF'
    @attach @beam

  remove: ->
    @unbind 'TweenEnd'
    @unbind 'EnterFrame'

  laserTurret: (config) ->
    @_config = config
    down = @_config.orientation isnt 'up'
    unless down
      @attr y: @y - @h

    @_updateBeam()

    @bind 'TweenEnd', =>
      @_motion @_motionFase + 1
    @bind 'EnterFrame', @_updateBeam

    @_motion(0)

  _updateBeam: ->
    beamLength = 500

    laserStart = @y + @h
    laserEnd = @y + @h + beamLength

    down = @_config.orientation isnt 'up'

    unless down
      laserStart = @y - beamLength
      laserEnd = beamLength

    @detectionBeam
      .attr(
        y: laserStart
        h: laserEnd
      )
    for object in @detectionBeam.hit('Edge')
      continue if object.obj is this
      continue if object.obj.has('Glass')
      if down
        collision = object.obj.y - laserStart
        if collision < laserEnd
          laserEnd = collision
      else
        collision = object.obj.y + object.obj.h
        if collision > laserStart
          laserStart = collision
          laserEnd = @y - collision

    @beam
      .attr(
        y: laserStart
        h: laserEnd
      )
    this

  _motion: (fase) ->
    @_motionFase = fase
    switch fase
      when 0
        @tween({ x: @x + @_config.range }, @_config.duration)
      when 1
        @delay (-> @_motion(@_motionFase + 1)), @_config.pauseOnEdges, 0
      when 2
        @tween({ x: @x - @_config.range }, @_config.duration)
      when 3
        @delay (-> @_motion(0)), @_config.pauseOnEdges, 0

