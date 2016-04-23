Crafty.c 'Sun',
  init: ->
    @requires '2D, WebGL, Collision, Choreography, ViewportFixed, sun'

    @attr(w: 20, h: 20, z: -1000)

    @origin 'center'
    @glare = []
    directGlare = Crafty.e('2D, WebGL, Glare, directGlare')
      .attr
        w: @w * 3
        h: @h * 3
        z: 90
        alpha: 0.8
        originalAlpha: 0.8
      .origin('center')
      #.color('#FFFFFF')
    @attach directGlare
    @glare.push directGlare

    blueGlare = Crafty.e('2D, WebGL, Glare, blueGlare, Horizon')
      .attr
        mirrored: yes
        w: 80
        h: 80
        z: 91
        res: 0.9
        alpha: 0.4
        originalAlpha: 0.4
        blur: 2.0
      .origin('center')
      .saturationGradient(1.0, 1.0)
      #.color('#B0B0FF')
    @attach blueGlare
    @glare.push blueGlare

    redGlare = Crafty.e('2D, WebGL, Glare, redGlare')
      .attr
        mirrored: yes
        w: 10
        h: 10
        z: 92
        res: 0.80
        alpha: 0.6
        originalAlpha: 0.6
      .origin('center')
      #.color('#FF9090')
    @attach redGlare
    @glare.push redGlare

    bigGlare = Crafty.e('2D, WebGL, Glare, bigGlare')
      .attr
        mirrored: yes
        w: 200
        h: 200
        z: 93
        alpha: 0.2
        res: 1.1
        originalAlpha: 0.2
      .origin('center')
      #.color('#FF9090')
    @attach bigGlare
    @glare.push bigGlare

  sun: (settings) ->
    @attr settings
    @uniqueBind 'GameLoop', @_updateGlare
    this

  remove: ->
    @unbind 'GameLoop', @_updateGlare

  _updateGlare: ->
    covered = [0]
    sunArea = @area()

    for o in @hit('SunBlock')
      e = o.obj
      if o.type is 'SAT'
        covered.push ((o.overlap * -1) / 50) * sunArea
      else
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
    dx = @x + (@w / 2) - ((Crafty.viewport.x * -1) + hw)
    dy = @y + (@h / 2) - ((Crafty.viewport.y * -1) + hh)
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
          w: @w * 5
          h: @h * 5
          x: @x - (2 * @w)
          y: @y - (2 * @h)

    # For sunrise / set on water
    horizonDistance = (Crafty.viewport.height - 225) - (Crafty.viewport._y) - @y

    size = 65.0 - (30.0 * (Math.min(Math.max(horizonDistance, 0), 200.0) / 200.0))
    blur = 2 - (2.0 * (Math.min(Math.max(horizonDistance, 0), 200.0) / 200.0))
    @attr blur: blur
    @w = size
    @h = size

    l = .4 + (Math.max(horizonDistance - 150, 0) / 200)
    cloudLightness = Math.min(Math.max(.4, l), 1.0)

    Crafty('cloud').each -> @attr lightness: cloudLightness

    Crafty('GoldenStripe').each ->
      if horizonDistance <= 0
        @attr
          alpha: 1.0 - (Math.min(Math.abs(horizonDistance), 20) / 20)
          h: 3
      else if 0 < horizonDistance < 1
        @attr
          alpha: 1.0
          h: 3
      else if horizonDistance < 60
        @attr
          alpha: 1.0
          h: Math.abs(Math.max(Math.min(horizonDistance / 2.0, 40.0), 3))
      else if horizonDistance < 120
        @attr
          alpha: 1.0 - (Math.min(Math.abs(horizonDistance - 60), 60.0) / 60.0)
          h: Math.abs(Math.max(Math.min(horizonDistance / 2.0, 40.0), 1))
      else
        @attr
          alpha: 0
          h: 10.0

