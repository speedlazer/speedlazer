Crafty.c 'Sun',
  init: ->
    @requires '2D, Canvas, Color, Choreography, ViewportFixed, Collision'
    @attr(w: 20, h: 20, z: -1000)
      .color('#DDDD00')

    @origin 'center'
    @glare = []
    directGlare = Crafty.e('2D, Canvas, Color, Glare')
      .attr
        w: @w * 1.5
        h: @h * 1.5
        z: 90
        alpha: 0.4
        originalAlpha: 0.4
      .color('#FFFFFF')
      .origin('center')
    @attach directGlare
    @glare.push directGlare

    blueGlare = Crafty.e('2D, Canvas, Color, Glare')
      .attr
        mirrored: yes
        w: 80
        h: 80
        z: 91
        res: 0.9
        alpha: 0.7
        originalAlpha: 0.7
      .color('#B0B0FF')
      .origin('center')
    @attach blueGlare
    @glare.push blueGlare

    redGlare = Crafty.e('2D, Canvas, Color, Glare')
      .attr
        mirrored: yes
        w: 10
        h: 10
        z: 92
        res: 0.82
        alpha: 0.8
        originalAlpha: 0.8
      .color('#FF9090')
      .origin('center')
    @attach redGlare
    @glare.push redGlare

    bigGlare = Crafty.e('2D, Canvas, Color, Glare')
      .attr
        mirrored: yes
        w: 200
        h: 200
        z: 93
        alpha: 0.2
        res: 1.1
        originalAlpha: 0.2
      .color('#FF9090')
      .origin('center')
    @attach bigGlare
    @glare.push bigGlare

  sun: (settings) ->
    @attr settings
    @bind 'EnterFrame', @_updateGlare
    this

  remove: ->
    @unbind 'EnterFrame', @_updateGlare

  _updateGlare: ->
    covered = [0]
    sunArea = @area()

    for o in @hit('2D')
      continue if o.obj is this
      continue if o.obj.has 'Glare'
      continue if o.obj.has 'HUD'
      e = o.obj
      xMin = Math.max(@x, e.x)
      xMax = Math.min(@x + @w, e.x + e.w)
      w = xMax - xMin
      yMin = Math.max(@y, e.y)
      yMax = Math.min(@y + @h, e.y + e.h)
      h = yMax - yMin
      covered.push(w * h)

    maxCoverage = Math.max(covered...) * 1.7
    perc = maxCoverage / sunArea
    perc = 1 if maxCoverage > sunArea

    hw = Crafty.viewport.width / 2
    hh = Crafty.viewport.height / 2
    dx = @x + (@w / 2) - ((Crafty.viewport._x * -1) + hw)
    dy = @y + (@h / 2) - ((Crafty.viewport._y * -1) + hh)
    px = dx / hw
    py = dy / hh

    for e in @glare
      e.attr alpha: e.originalAlpha * (1 - perc)
      if e.mirrored
        e.attr
          x: @x + (@w / 2) - (e.w / 2) - (dx * 2 * e.res)
          y: @y + (@h / 2) - (e.h / 2) - (dy * 2 * e.res)
      else
        e.attr
          w: @w * 1.5
          h: @h * 1.5
          x: @x + (@w / 2) - (e.w / 2)
          y: @y + (@h / 2) - (e.h / 2)

    # For sunrise / set on water
    horizonDistance = (480 - 155) - (Crafty.viewport._y) - @y

    size = 20.0 + (15.0 * (Math.min(Math.max(horizonDistance, 0), 150.0) / 150.0))
    @w = size
    @h = size

    Crafty('GoldenStripe').each ->
      if horizonDistance <= 0
        @attr
          alpha: 1.0 - (Math.min(Math.abs(horizonDistance), 10.0) / 10.0)
          h: 1
      else if 0 < horizonDistance < 1
        @attr
          alpha: 1.0
          h: 1
      else if horizonDistance < 40
        @attr
          alpha: 1.0 - (Math.min(Math.abs(horizonDistance), 40.0) / 40.0)
          h: Math.abs(Math.min(horizonDistance / 2.0, 20.0))
      else
        @attr
          alpha: 0
          h: 20.0


