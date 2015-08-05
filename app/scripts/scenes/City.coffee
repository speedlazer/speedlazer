Crafty.defineScene 'City', (data) ->

  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#602020')

  level = Game.levelGenerator.createLevel
    stage: data.stage
    title: 'City'
  level.addBlock('Generic.Start')
  level.addBlock('City.Ocean')
  level.generateBlocks amount: 10
  level.addBlock('GameplayDemo.End')
  level.start()

  v = 0
  co =
    r: 0x60
    g: 0x20
    b: 0x20
  cd =
    r: 0x80
    g: 0x80
    b: 0xFF
  steps = 80
  Crafty.e('Delay').delay(
    =>
      v += 1
      p = v * 1.0 / steps
      c =
        r: co.r * (1 - p) + cd.r * p
        b: co.b * (1 - p) + cd.g * p
        g: co.g * (1 - p) + cd.b * p
      cs = (i.toString(16).slice(0, 2) for k, i of c)

      Crafty.background("##{cs.join('')}")
      #console.log "##{cs.join('')}"
  , 500, steps - 1)

  duration = steps * 500 * 2

  sun = Crafty.e('2D, Canvas, Color, ViewportRelativeMotion, Tween, Collision')
    .attr(w: 60, h: 60, z: -1000)
    .color('#DDDD00')
    .viewportRelativeMotion(
      x: 550
      y: 410
      speed: 0
    )
    .tween({ dy: -340 }, duration)
    .attr(dx: 200)

  glare = []
  glare.push(Crafty.e('2D, Canvas, Color, ViewportRelativeMotion, Tween, Glare')
    .attr(w: 90, h: 90, z: 900, alpha: 0.4, originalAlpha: 0.4)
    .color('#FFFFFF')
    .viewportRelativeMotion(
      x: 550
      y: 395
      speed: 0
    )
    .tween({ dy: -340 }, duration)
    .attr(dx: 185)
  )
  glare.push(Crafty.e('2D, Canvas, Color, ViewportRelativeMotion, Tween, Glare')
    .attr(w: 80, h: 80, z: 1000, alpha: 0.7, originalAlpha: 0.7)
    .color('#B0B0FF')
    .viewportRelativeMotion(
      x: 150
      y: 10
      speed: 0
    )
    .tween({ dy: 340 }, duration)
    .attr(dx: -200)
  )

  glare.push(Crafty.e('2D, Canvas, Color, ViewportRelativeMotion, Tween, Glare')
    .attr(w: 10, h: 10, z: 1000, alpha: 0.8, originalAlpha: 0.8)
    .color('#FF9090')
    .viewportRelativeMotion(
      x: 150
      y: 80
      speed: 0
    )
    .tween({ dy: 250 }, duration)
    .attr(dx: -100)
  )

  glare.push(Crafty.e('2D, Canvas, Color, ViewportRelativeMotion, Tween, Glare')
    .attr(w: 200, h: 200, z: 1000, alpha: 0.2, originalAlpha: 0.2)
    .color('#FF9090')
    .viewportRelativeMotion(
      x: 150
      y: -80
      speed: 0
    )
    .tween({ dy: 410 }, duration)
    .attr(dx: -300)
  )
  Crafty.bind 'EnterFrame', ->
    covered = [0]
    sunArea = sun.area()

    for o in sun.hit('2D')
      continue if o.obj is sun
      continue if o.obj.has 'Glare'
      e = o.obj
      xMin = Math.max(sun.x, e.x)
      xMax = Math.min(sun.x + sun.w, e.x + e.w)
      w = xMax - xMin
      yMin = Math.max(sun.y, e.y)
      yMax = Math.min(sun.y + sun.h, e.y + e.h)
      h = yMax - yMin
      covered.push(w * h)


    perc = Math.max(covered...) / sunArea
    perc = 1 if covered > sunArea
    for e in glare
      e.attr alpha: e.originalAlpha * (1 - perc)


  Crafty.bind 'EndOfLevel', ->
    level.stop()
    Crafty.enterScene('GameplayDemo', { stage: data.stage + 1 })

  Crafty.bind 'PlayerDied', ->
    playersActive = no
    Crafty('Player ControlScheme').each ->
      playersActive = yes if @lives > 0

    unless playersActive
      level.stop()
      Crafty.enterScene('GameOver')

, ->
  # destructor
  Crafty.unbind('PlayerDied')
  Crafty.unbind('EndOfLevel')
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
