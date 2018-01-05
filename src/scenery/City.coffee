extend = require('lodash/extend')
levelGenerator = require('src/lib/LevelGenerator').default
cityScenery = require('src/images/city-scenery.png')
LevelScenery = require('src/lib/LevelScenery').default

levelGenerator.defineElement 'cloud', ->
  v = Math.random()
  blur = (Math.random() * 4.0)
  if v > .2
    y = (Math.random() * 20) + 30
    w = (Math.random() * 20) + 125
    h = (Math.random() * 10) + 50
    c1 = Crafty.e('2D, WebGL, cloud, Hideable, Horizon').attr(
      z: -300
      w: w
      h: h
      topDesaturation: 0.6
      bottomDesaturation: 0.6
      alpha: (Math.random() * 0.8) + 0.2
      lightness: .4
      blur: blur
    )
    if Math.random() < 0.7
      c1 = c1.flip('X')
    @addBackground(300 + (Math.random() * 300), y, c1, .375)

  if v < .6
    s = (Math.random() * .20) + .15

    y = 230 - (s * 150)
    w = ((Math.random() * 10) + 70) - (s * 20)
    h = ((Math.random() * 5) + 20) - (s * 10)
    c2 = Crafty.e('2D, WebGL, cloud, Hideable, Horizon').attr(
      z: -570
      w: w
      h: h
      topDesaturation: 1.0 - s
      bottomDesaturation: 1.0 - s
      alpha: (Math.random() * 0.8) + 0.2
      lightness: .4
      blur: blur
    )
    if Math.random() < 0.2
      c2 = c2.flip('X')
    @addBackground(360 + Math.random() * 300, y, c2, s)

levelGenerator.defineElement 'waterHorizon', ->
  h = Crafty.e('2D, WebGL, waterHorizon, SunBlock, Horizon, ColorEffects')
    .attr(z: -600, w: 257)
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(1.0, .2)
  if Game.webGLMode is off
    h.attr lightness: .6
  @addBackground(0, @level.visibleHeight - 225, h, .25)

  goldenStripe = Crafty.e('2D, WebGL, Gradient, GoldenStripe')
    .topColor('#DDDD00')
    .bottomColor('#DDDD00', if Game.webGLMode isnt off then 0 else 1)
    .attr(z: -599, w: (@delta.x * .25), h: 1, alpha: 0)
  @addBackground(0, @level.visibleHeight - 225, goldenStripe, .25)

levelGenerator.defineElement 'water', ->
  h = Crafty.e('2D, WebGL, waterMiddle, Horizon')
    .crop(1, 0, 511, 192)
    .attr(z: -500, w: 513)
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.7, -.4)
  if Game.webGLMode is off
    h.attr lightness: .8
  @addBackground(0, @level.visibleHeight - 150, h, .5)

  @level.registerWaveTween 'OceanWavesMiddle', 5500, 'easeInOutQuad', (v, forward) ->
    moveh = 5
    distanceh = 20
    height = 192
    Crafty('waterMiddle').each ->
      if forward
        @dy = (v * moveh)
        @h = height - (v * distanceh)
      else
        @dy = moveh - (v * moveh)
        @h = height - distanceh + (v * distanceh)

levelGenerator.defineElement 'waterFront', ->
  height = 65
  @add(0, @level.visibleHeight - 45, Crafty.e('2D, Solid').attr(w: @delta.x, h: 45))

  water1 = Crafty.e('2D, Delta2D, WebGL, waterFront1, Wave1')
    .attr(z: -20)
    .crop(0, 1, 512, 95)
  @add(0, @level.visibleHeight - height, water1)
  #water1.waveY = 0

  water2 = Crafty.e('2D, WebGL, waterFront2, Wave2')
  water1.attach(water2)
  water2.attr(
      z: -20
      x: water1.x + water1.w
      y: water1.y
    )
    .crop(0, 1, 512, 95)

  @level.registerWaveTween 'OceanWaves', 6000, 'easeInOutQuad', (v, forward) ->
    distance = 50
    distanceh = 40
    moveh = 8
    width = 513
    height = 125

    Crafty('Wave1').each ->
      w = width + (v * distance)
      y = (v * moveh)
      h = height - (v * distanceh)

      if !forward
        w = width + distance - (v * distance)
        y = moveh - (v * moveh)
        h = height - distanceh + (v * distanceh)
      wShift = w - @w
      #@shift(0, 0, wShift, h - @h)
      @attr(dy: y, w: w, h: h)
      @_children.forEach((e) ->
        e.shift(wShift)
      )

    Crafty('Wave2').each ->
      if forward
        w = width - (v * distance)
        h = height - (v * distanceh)
      else
        w = width - distance + (v * distance)
        h = height - distanceh + (v * distanceh)
      @attr(w: w, h: h)

    Crafty('WaveFront').each ->
      width = 1200
      distance = 120
      height = 200
      distanceh = 80

      if forward
        w = width + (v * distance)
        y = (v * moveh)
        h = height - (v * distanceh)
      else
        w = width + distance - (v * distance)
        y = moveh - (v * moveh)
        h = height - distanceh + (v * distanceh)

      @shift(0, y - @waveY, w - @w, h - @h)
      @waveY = y

levelGenerator.defineElement 'cityHorizon', (mode) ->
  @addElement 'waterHorizon'
  e = if mode is 'start'
    Crafty.e('2D, WebGL, coastStart, SunBlock, Horizon')
  else
    Crafty.e('2D, WebGL, coast, SunBlock, Horizon')
  e.colorDesaturation(Game.backgroundColor)
    .saturationGradient(.9, .8)
    .crop(1, 0, 255, 32)
    .attr(z: -598, w: 256)
  @addBackground(0, @level.visibleHeight - 225 - 16, e, .25)

levelGenerator.defineElement 'cityDistance', (mode) ->
  e = Crafty.e('2D, WebGL, cityDistance, SunBlock, Horizon')
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.9, .6)
    .crop(1, 1, 255, 223)
    .attr(z: -598, w: 256)

  @addBackground(0, @level.visibleHeight - 225 - 16, e, .25)

levelGenerator.defineElement 'city', ->
  bg = Crafty.e('2D, WebGL, cityLayer2, Collision, SunBlock, Horizon, Flipable')
    .attr(z: -505) #, blur: 1.2)
    .collision([4, 29, 72, 29, 72, 118, 4, 118])
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.6, .6)
  @addBackground(0, @level.visibleHeight - 350, bg, .375)

  e = Crafty.e('2D, WebGL, city, Collision, SunBlock, Horizon')
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.4, .4)
    .crop(0, 0, 511, 288)
    .attr(z: -305, w: 513)
  e.collision([35, 155, 35, 10, 130, 10, 160, 155])

  c = Crafty.e('2D, Collision, SunBlock')
  c.attr(w: e.w, h: e.h)
  c.collision([190, 155, 170, 80, 210, 10, 280, 10, 280, 155])

  d = Crafty.e('2D, Collision, SunBlock')
  d.attr(w: e.w, h: e.h)
  d.collision([370, 155, 370, 40, 505, 40, 505, 155])

  @addBackground(0, @level.visibleHeight - 310, e, .5)
  @addBackground(0, @level.visibleHeight - 310, c, .5)
  @addBackground(0, @level.visibleHeight - 310, d, .5)

levelGenerator.defineElement 'cityFrontTop', ->
  bb = Crafty.e('2D, WebGL, bigBuildingTop, ColorEffects, RiggedExplosion').attr(z: -20).crop(1, 1, 446, 6 * 32)
  bb.colorOverride('#001fff', 'partial')
  @add(0, @level.visibleHeight - 1200, bb)

  for i in [0...3]
    floor = Crafty.e('2D, WebGL, bigBuildingLayer, ColorEffects').attr(z: -20).crop(1, 0, 446, 4 * 32)
    floor.attr(x: bb.x, y: bb.y + bb.h + (i * floor.h))
    bb.attach(floor)

  bb.bind('BigExplosion', ->
    return if @buildingExploded
    if @x + @w > -Crafty.viewport.x and @x < -Crafty.viewport.x + Crafty.viewport.width

      Crafty.e('2D, WebGL, glass, Tween')
        .attr(x: @x, y: @y + 40, z: @z + 5)
        .bind('TweenEnd', -> @destroy())
        .tween({ y: @y + 500}, 3000, 'easeInQuad')

      Crafty.e('2D, WebGL, glass, Tween')
        .attr(x: @x + 200, y: @y + 60, z: @z + 5)
        .bind('TweenEnd', -> @destroy())
        .tween({ y: @y + 500}, 3000, 'easeInQuad')

      Crafty.e('2D, WebGL, glass, Tween')
        .attr(x: @x, y: @y + 180, z: @z + 5)
        .bind('TweenEnd', -> @destroy())
        .tween({ y: @y + 500}, 3000, 'easeInQuad')

      Crafty.e('2D, WebGL, glass, Tween')
        .attr(x: @x + 180, y: @y + 200, z: @z + 5)
        .bind('TweenEnd', -> @destroy())
        .tween({ y: @y + 500}, 3000, 'easeInQuad')

      @sprite(30, 13)
      for e in @_children
        e.sprite(30, 19) if e.has('bigBuildingLayer')
      @buildingExploded = yes
  )

levelGenerator.defineElement 'cityFront', (height = 6, offSet = 0, bottomVariant = 'bigBuildingBottom') ->
  bb = Crafty.e('2D, WebGL, bigBuildingTop, Collision, SunBlock, ColorEffects').attr(z: -20).crop(1, 1, 446, 6 * 32)
  bb.colorOverride('#001fff', 'partial')
  calcHeight = (height + 2.5) * 128
  bb.collision([32, 80, 160, 16, 416, 16, 416, calcHeight, 32, calcHeight])
  @add(offSet, @level.visibleHeight - calcHeight - 16, bb)

  for i in [0...height]
    floor = Crafty.e('2D, WebGL, bigBuildingLayer, ColorEffects').attr(z: -20).crop(1, 0, 446, 4 * 32)
    floor.attr(x: bb.x, y: bb.y + bb.h + (i * floor.h))
    bb.attach(floor)

  bottom = Crafty.e("2D, WebGL, #{bottomVariant}, ColorEffects").attr(z: -20).crop(1, 1, 446, 184)
  bottom.attr(x: bb.x, y: bb.y + bb.h + (height * 128))
  bb.attach(bottom)

levelGenerator.defineElement 'cityFrontBlur', ->
  @addBackground(200, @level.visibleHeight - 1350, Crafty.e('2D, WebGL, bigBuildingTop').crop(1, 1, 446, 6 * 32).attr(w: 768, h: 288, z: 50, lightness: .4), 1.5)

levelGenerator.defineElement 'city-bridge', ->
  bg = Crafty.e('2D, WebGL, cityLayer2, Collision, SunBlock, Horizon')
    .collision([4, 29, 72, 29, 72, 118, 4, 118])
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.6, .6)
    .attr(z: -505) #, blur: 1.2)
  @addBackground(0, @level.visibleHeight - 350, bg, .375)

  e = Crafty.e('2D, WebGL, cityBridge, Collision, Horizon')
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.4, .4)
    .crop(0, 0, 511, 160)
    .attr(z: -305, w: 513)
  e.collision([35, 155, 35, 0, 130, 0, 130, 155])

  @addBackground(0, @level.visibleHeight - 182, e, .5)

levelGenerator.defineElement 'cityStart', ->
  e = Crafty.e('2D, WebGL, cityStart, Collision, SunBlock, Horizon')
    .attr(z: -305)
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.4, .4)
  e.collision([215, 155, 215, 60, 300, 60, 300, 10, 500, 10, 500, 155])
  @addBackground(0, @level.visibleHeight - 310, e, .5)

class CityScenery extends LevelScenery
  assets: ->
    sprites:
      "#{cityScenery}":
        tile: 32
        tileh: 32
        map:
          waterHorizon: [0, 17, 8, 5]
          waterMiddle: [32, 0, 16, 6]
          waterFront1: [0, 29, 16, 3]
          waterFront2: [16, 29, 16, 3]
          coastStart: [8, 18, 8, 1]
          coast: [8, 17, 8, 1]

          cityBridge: [0, 24, 16, 5]
          cityStart: [0, 0, 16, 9]
          city: [16, 0, 16, 9]
          cityLayer2: [0, 9, 12, 8]
          cityDistance: [32, 6, 8, 7]
          cityDistanceBaseBottom: [32, 9, 8, 4]
          cityDistanceBaseTop: [40, 6, 8, 7]

          bigBuildingTop: [16, 13, 16, 6]
          bigBuildingBrokenTop: [30, 13, 16, 6]

          bigBuildingLayer: [16, 19, 16, 4]
          bigBuildingBottom: [16, 23, 16, 6]
          bigBuildingBottom2: [30, 23, 16, 6]

          glass: [12, 9, 4, 3]
          cloud: [16, 9, 8, 3]
          shadow: [16, 12, 2, 1]
          bridgeDeck: [0, 32, 16, 6]
          damagedBridgeDeck: [0, 48, 16, 6]
          bridgePillar: [36, 29, 6, 17]
          bridgePillarBroken: [42, 29, 6, 17]
          bigGlare: [0, 38, 7, 7]
          sun: [0, 22, 2, 2]
          directGlare: [7, 38, 6, 6]
          aircraftCarrierEnd: [30, 43, 6, 5]
          aircraftCarrierStart: [13, 43, 6, 5]
          aircraftCarrierBottomFlat: [19, 45, 6, 3]
          aircraftCarrierBottomSpace: [25, 45, 4, 3]
          aircraftCarrierTopFlat: [26, 43, 4, 2]

          aircraftCarrierOpenHatch: [31, 40, 5, 1]

          aircraftCarrierCabinEnd: [24, 38, 2, 7]
          aircraftCarrierCabin: [22, 38, 2, 7]
          aircraftCarrierCabinRadar: [20, 38, 2, 7]
          aircraftCarrierCabinStart: [19, 38, 1, 7]
          aircraftCarrierRadar: [26, 38, 2, 2]
          aircraftCarrierAntenna: [29, 38, 2, 3]
          boxes: [28, 39, 1, 1]
          boxesFalling: [28, 38, 1, 1]

Crafty.c('carrierHatch', {
  init: ->
    @requires '2D, WebGL, aircraftCarrierOpenHatch, SpriteAnimation'
    @attr(z: -10)
    @crop 0, 2, 5*32, 32

    @reel 'open', 600, [
      [31, 40]
      [31, 38]
      [31, 39]
    ]

    @reel 'close', 600, [
      [31, 39]
      [31, 38]
      [31, 40]
    ]
})

levelGenerator.defineBlock class extends CityScenery
  name: 'City.Intro'
  delta:
    x: 1024
    y: 0
  autoNext: 'Ocean'

  generate: ->
    super

    @addElement 'waterFront'

    barrelLocator = Crafty.e('2D, BoxesLocation, WebGL, Color').color('FF0000')
    @add(550, @level.visibleHeight - 360 + (7*32), barrelLocator)

    barrelLocator = Crafty.e('2D, BoxesLocation, WebGL, Color').color('0000FF')
    @add(550 + 64, @level.visibleHeight - 360 + (7*32), barrelLocator)

    barrelLocator = Crafty.e('2D, WebGL, boxes').attr(z: -8)
    @add(550 + 72, @level.visibleHeight - 340 + (5*32), barrelLocator)

    @outside = Crafty.e('2D, WebGL').attr({
      w: 25 * 32
      h: 4 * 32
    })
    @add(0, @level.visibleHeight - 330 + (7 * 32), @outside)

    end = Crafty.e('2D, WebGL, aircraftCarrierEnd').attr(z: -13)
    @add(22*32, @level.visibleHeight - 330 + (5*32), end)

    water = Crafty.e('2D, WebGL, WaterSplashes')
      .attr(
        z: 30
        w: 32 * 25
        h: 32 * 5
        alpha: 0.3
      )
      .attr({
        waterRadius: 8
        minSplashDuration: 1700
        defaultWaterCooldown: 800
        waterSplashSpeed: 700
        minOffset: 2
        splashUpwards: false
      })

    @add(0, @level.visibleHeight - 330 + (5 * 32), water)

    p1hatch = Crafty.e('carrierHatch')
    @add((5*32) + 100, @level.visibleHeight - 330 + (6*32), p1hatch)

    p2hatch = Crafty.e('carrierHatch')
    @add((5*32) - 100, @level.visibleHeight - 330 + (6*32), p2hatch)

    for i in [0..3]
      bottom = Crafty.e('2D, WebGL, aircraftCarrierBottomFlat').attr(z: 20)
      @add(((i * 6)*32) - 64, @level.visibleHeight - 330 + (7*32), bottom)

    for i in [4, 5]
      top = Crafty.e('2D, WebGL, aircraftCarrierTopFlat').attr(z: -13)
      @add(((i * 4)*32) - 64, @level.visibleHeight - 330 + (5*32), top)

    top = Crafty.e('2D, WebGL, aircraftCarrierTopFlat').attr(z: -13)
    @add(-32, @level.visibleHeight - 330 + (5*32), top)

    cEnd = Crafty.e('2D, WebGL, aircraftCarrierCabinEnd, ColorEffects').attr(z: -13)
    cEnd.colorOverride({ _red: 255, _green: 255, _blue: 255 }, 'partial')
    @add((32 * 12), @level.visibleHeight - 330, cEnd)

    c3 = Crafty.e('2D, WebGL, aircraftCarrierCabin, ColorEffects').attr(z: -13)
    c3.colorOverride({ _red: 255, _green: 255, _blue: 255 }, 'partial')
    @add((32 * 10), @level.visibleHeight - 330, c3)

    c2 = Crafty.e('2D, WebGL, aircraftCarrierCabinRadar, ColorEffects').attr(z: -13)
    c2.colorOverride({ _red: 255, _green: 255, _blue: 255 }, 'partial')
    @add((32 * 8), @level.visibleHeight - 330, c2)

    radar = Crafty.e('2D, WebGL, aircraftCarrierRadar').attr(z: -11)
    @add((32 * 6), @level.visibleHeight - 330 + 22, radar)

    antenna = Crafty.e('2D, WebGL, aircraftCarrierAntenna').attr(z: -11)
    @add((32 * 9), @level.visibleHeight - 318 - 32, antenna)

    c1 = Crafty.e('2D, WebGL, aircraftCarrierCabin, ColorEffects').attr(z: -13)
    c1.colorOverride({ _red: 255, _green: 255, _blue: 255 }, 'partial')
    @add((32 * 4), @level.visibleHeight - 330, c1)

    cRadar = Crafty.e('2D, WebGL, aircraftCarrierCabinRadar, ColorEffects').attr(z: -13)
    cRadar.colorOverride({ _red: 255, _green: 255, _blue: 255 }, 'partial')
    @add((32 * 6), @level.visibleHeight - 330, cRadar)

    cStart = Crafty.e('2D, WebGL, aircraftCarrierCabinStart, ColorEffects').attr(z: -13)
    cStart.colorOverride({ _red: 255, _green: 255, _blue: 255 }, 'partial')
    @add((32 * 3), @level.visibleHeight - 330, cStart)

    @addElement 'water'
    @addElement 'waterHorizon'

    frontWave = Crafty.e('2D, WebGL, waterFront1, WaveFront').attr(
      z: 30
      w: ((@delta.x + Crafty.viewport.width * .5)) + 1
      h: 200
      lightness: 0.5
      #blur: 6.0
    ).crop(0, 1, 512, 95)
    @addBackground(0, @level.visibleHeight - 18, frontWave, 1.25)
    frontWave.waveY = 0

    @addElement 'cloud'

  enter: ->
    super
    @speed = @level._forcedSpeed
    Crafty('ScrollWall').attr y: 120
    @level.setForcedSpeed 0
    c = [
        type: 'delay'
        duration: 1000
      ,
        type: 'delay'
        duration: 600
        event: 'openHatch'
      ,
        type: 'linear'
        y: -80
        duration: 800
        easingFn: 'easeInOutQuad'
      ,
        event: 'lift'
        type: 'linear'
        x: 70
        y: -10
        easingFn: 'easeInQuad'
        duration: 600
      ,
        type: 'delay'
        duration: 1
        event: 'unlock'
      ,
        type: 'delay'
        duration: 1
        event: 'go'
    ]
    block = this
    leadAnimated = null

    fixOtherShips = (newShip) ->
      return unless leadAnimated
      return unless leadAnimated.has 'Choreography'
      newShip.attr(x: leadAnimated.x - 200, y: leadAnimated.y)
      newShip.disableControl() if leadAnimated.disableControls
      newShip.addComponent 'Choreography'
      newShip.synchChoreography leadAnimated
      newShip.one 'ChoreographyEnd', ->
        @removeComponent 'Choreography', no
      newShip.one 'unlock', ->
        @enableControl()
        @weaponsEnabled = yes
      newShip.weaponsEnabled = leadAnimated.weaponsEnabled

    @bind 'ShipSpawned', fixOtherShips
    Crafty('PlayerControlledShip').each (index) ->
      return fixOtherShips(this) unless index is 0
      leadAnimated = this
      @addComponent 'Choreography'
      @attr x: 300 - (200 * index), y: Crafty.viewport.height - 50 - @h
      @disableControl()
      @weaponsEnabled = no
      @choreography c
      @one 'ChoreographyEnd', =>
        @removeComponent 'Choreography', 'no'
        block.unbind 'ShipSpawned'
      @one 'unlock', ->
        @enableControl()
        @weaponsEnabled = yes
      @one 'openHatch', ->
        Crafty('carrierHatch').each ->
          @animate('open')
      @one 'lift', ->
        block.outside.addComponent('Solid')
        Crafty('carrierHatch').each ->
          @animate('close')
        Crafty('aircraftCarrierBottomFlat').each ->
          @attr(z: -13)
        Crafty('ScrollWall').each ->
          @addComponent 'Tween'
          @tween { y: 0 }, 2500
          @one 'TweenEnd', -> @removeComponent 'Tween', no
      @one 'go', ->
        block.level.setForcedSpeed block.speed, accelerate: no

levelGenerator.defineBlock class extends CityScenery
  name: 'City.Ocean'
  delta:
    x: 1024
    y: 0

  generate: ->
    super

    @addElement 'cloud'
    @addElement 'cloud'
    @addElement 'waterHorizon'
    @addElement 'water'
    @addElement 'waterFront'

levelGenerator.defineBlock class extends CityScenery
  name: 'City.CoastStart'
  delta:
    x: 1024
    y: 0
  autoNext: 'Coast'
  autoPrevious: 'Ocean'

  generate: ->
    super
    @addElement 'cloud'
    @addElement 'cityHorizon', 'start'
    @addElement 'water'
    @addElement 'waterFront'

levelGenerator.defineBlock class extends CityScenery
  name: 'City.Coast'
  delta:
    x: 1024
    y: 0

  generate: ->
    super
    @addElement 'waterFront'
    @addElement 'cityHorizon'
    @addElement 'water'
    @addElement 'cloud'

levelGenerator.defineBlock class extends CityScenery
  name: 'City.BayStart'
  delta:
    x: 1024
    y: 0
  autoNext: 'Bay'
  autoPrevious: 'Coast'

  generate: ->
    super
    @addElement 'cloud'
    @addElement 'cityHorizon'
    @addElement 'water'
    @addElement 'waterFront'
    @addElement 'cityStart'

levelGenerator.defineBlock class extends CityScenery
  name: 'City.Bay'
  delta:
    x: 1024
    y: 0

  generate: ->
    super
    @addElement 'cloud'
    @addElement 'waterFront'
    @addElement 'water'
    @addElement 'cityHorizon'
    @addElement 'city'

levelGenerator.defineBlock class extends CityScenery
  name: 'City.BayFull'
  delta:
    x: 1024
    y: 0

  generate: ->
    super
    @addElement 'cloud'
    @addElement 'waterFront'
    @addElement 'water'
    @addElement 'cityDistance'
    @addElement 'city'

levelGenerator.defineBlock class extends CityScenery
  name: 'City.UnderBridge'
  delta:
    x: 1024
    y: 0
  autoNext: 'BayFull'

  generate: ->
    super
    @notifyOffsetX = -100

    @addElement 'waterFront', lightness: 0.8
    @addElement 'water'
    @addElement 'cityDistance'
    @addElement 'city-bridge'

    bridgeWidth = Crafty.viewport.width
    height = Crafty.viewport.height * 1.1

    # 2 front pillars

    @addBackground(0, 335,  @deck(.55, no, w: 550, z: -280), .55)
    @addBackground(0, 295,  @deck(.45, yes, w: 600, z: -270), .60)
    @addBackground(0, 255,  @deck(.35, no, w: 650, z: -260), .65)

    @addBackground(40, 290,  @pillar( .35, h: 200, z: -261), .65)
    @addBackground(870, 290,  @pillarX(.35, h: 200, z: -261), .65)

    @addBackground(0, 205,  @deck(.25, yes, w: 700, z: -50), .70)
    @addBackground(0, 155,  @deck(.15, no, w: 750, z: -40), .75)

    @addBackground(10, 180, @pillar( 0, h: 350, z: -31), .8)
    @addBackground(830, 180, @pillarX(0, h: 350, z: -31), .8)
    @addBackground(0, 95,  @deck(.05, yes, w: 800, z: -30), .8)

    @addBackground(0, 20,   @deck(0, no,  w: 900, z: -20).addComponent('BackDeck'), .9)

    dh = Crafty.e('2D, Solid, Collision, BridgeCeiling').attr(w: 1000, h: 30).origin('middle middle')
    @addBackground(0, -60, dh, 1.0)

    d1 = @deck(0, yes, w: 1000, z: -10).addComponent('MainDeck')

    @addBackground(0, -60, d1, 1.0)
    @addBackground(0, -180, @deck(0, no, w: 1200, z: 100, lightness: 0.6, blur: 0.0).addComponent('FrontDeck'), 1.2)

    p1 = @pillar( 0, h: 750, z: 80, lightness: 0.6, blur: 0.0).addComponent('TiltPillarLeft')
    p2 = @pillarX(0, h: 750, z: 80, lightness: 0.6, blur: 0.0).addComponent('TiltPillarRight')

    @addBackground(-20,  -60, p1, 1.2)
    @addBackground(834, -60, p2, 1.2)

    @bind 'BridgeDamage', once: yes, (level) ->
      get = (name) ->
        s = Crafty(name)
        s.get(s.length - 1)

      d0 = get('FrontDeck').addComponent('TweenPromise', 'Delta2D').sprite(16, 32)
      d1 = get('MainDeck').addComponent('TweenPromise', 'Delta2D').sprite(16, 32)
      d2 = get('BackDeck').addComponent('TweenPromise', 'Delta2D').sprite(16, 32)
      d0.half.sprite(16, 32)
      d1.half.sprite(16, 32)
      d2.half.sprite(16, 32)

      p1 = get('TiltPillarLeft').addComponent('TweenPromise', 'Delta2D').sprite(42, 29)
      p2 = get('TiltPillarRight').addComponent('TweenPromise', 'Delta2D').sprite(42, 29)
      dh = get('BridgeCeiling').addComponent('TweenPromise', 'Delta2D')

    @bind 'BridgeCollapse', once: yes, (level) =>
      get = (name) ->
        s = Crafty(name)
        s.get(s.length - 1)

      d0 = get('FrontDeck').addComponent('TweenPromise', 'Delta2D').sprite(16, 32)
      d1 = get('MainDeck').addComponent('TweenPromise', 'Delta2D').sprite(16, 32)
      d2 = get('BackDeck').addComponent('TweenPromise', 'Delta2D').sprite(16, 32)
      d0.half.sprite(16, 32)
      d1.half.sprite(16, 32)
      d2.half.sprite(16, 32)

      p1 = get('TiltPillarLeft').addComponent('TweenPromise', 'Delta2D').sprite(42, 29)
      p2 = get('TiltPillarRight').addComponent('TweenPromise', 'Delta2D').sprite(42, 29)
      dh = get('BridgeCeiling').addComponent('TweenPromise', 'Delta2D')

      WhenJS.sequence [
        ->
          WhenJS.parallel [
            -> level.setForcedSpeed 75, accelerate: yes
            -> d0.tweenPromise({ rotation: -12, dy: d0.dy + 100 }, 4000, 'easeInQuad')
            -> d1.tweenPromise({ rotation: -10, dy: d1.dy + 100 }, 4000, 'easeInQuad')
            -> dh.tweenPromise({ rotation: -10, dy: dh.dy + 100 }, 4000, 'easeInQuad')
            -> d2.tweenPromise({ rotation: -7, dy: d2.dy + 100 }, 4000, 'easeInQuad')
            -> p1.tweenPromise({ rotation: -7, dy: p1.dy + 100 }, 3000, 'easeInQuad')
            -> p2.tweenPromise({ rotation: 7 }, 3000, 'easeInQuad')
          ]
        ->
          WhenJS.parallel [
            -> level.setForcedSpeed 300, accelerate: yes
            -> d0.tweenPromise({ dy: d0.dy + 400 }, 4000, 'easeInQuad')
            -> d1.tweenPromise({ dy: d1.dy + 430 }, 4000, 'easeInQuad')
            -> dh.tweenPromise({ dy: dh.dy + 430 }, 4000, 'easeInQuad')
            -> d2.tweenPromise({ dy: d2.dy + 400 }, 4000, 'easeInQuad')
            -> p1.tweenPromise({ rotation: -27, dy: p1.dy + 300 }, 3000, 'easeInQuad')
            -> p2.tweenPromise({ rotation: 27, dy: p2.dy + 200 }, 3000, 'easeInQuad')
          ]
      ]

  leave: ->
    super
    @unbind('BridgeDamage')
    @unbind('BridgeCollapse')


  deck: (gradient, flipped, attr) ->
    aspectR = 1024 / 180
    attr.h = attr.w / aspectR
    color = if flipped then '#2ba04c' else '#b15a5a'
    result = Crafty.e('2D, WebGL, bridgeDeck, Horizon, SunBlock, SpriteAnimation')
      .crop(0, 2, 511, 180)
      .attr(extend(attr, w: attr.w / 2))
      .saturationGradient(gradient, gradient)
      .colorOverride color, 'partial'

    part2 = Crafty.e('2D, WebGL, bridgeDeck, Horizon, SunBlock, SpriteAnimation')
      .crop(0, 2, 511, 180)
      .saturationGradient(gradient, gradient)
      .flip('X')
      .colorOverride color, 'partial'
    part2.attr(extend(attr,
      x: result.x + result.w
      y: result.y
      z: result.z
      w: result.w
      h: result.h
    ))
    result.half = part2
    result.attach part2
    result.origin(result.h / 2, result.w * 2)

    result

  pillar: (gradient, attr) ->
    aspectR = 180 / 534
    attr.w = attr.h * aspectR
    attr.h = attr.h
    Crafty.e('2D, WebGL, bridgePillar, Horizon, SunBlock')
      .crop(2, 0, 180, 534)
      .attr(attr)
      .saturationGradient(gradient, gradient)

  pillarX: (gradient, attr) ->
    @pillar(gradient, attr).flip('X')


levelGenerator.defineBlock class extends CityScenery
  name: 'City.Skyline'
  delta:
    x: 1024
    y: 0

  generate: ->
    super

    @addElement 'cityFrontTop'
    @addElement 'cityFrontBlur'
    @addElement 'water'

    @addElement 'cityDistance'
    @addElement 'city'

levelGenerator.defineBlock class extends CityScenery
  name: 'City.SkylineBase'
  delta:
    x: 1024
    y: 0
  autoNext: 'Skyline2'

  generate: ->
    super
    @addElement 'cityFront'
    h = 400 + 200

    e = Crafty.e('2D, WebGL, cityDistanceBaseTop, SunBlock, Horizon')
      .colorDesaturation(Game.backgroundColor)
      .saturationGradient(.9, .6)
      .crop(1, 1, 255, 223)
      .attr(z: -598, w: 256)

    @addBackground(0, @level.visibleHeight - 225 - 16 - 127, e, .25)

    eb = Crafty.e('2D, WebGL, cityDistanceBaseBottom, MiliBase, SunBlock, Horizon')
      .colorDesaturation(Game.backgroundColor)
      .saturationGradient(.9, .6)
      .crop(1, 1, 255, 127)
      .attr(z: -598, w: 256)

    @addBackground(0, @level.visibleHeight - 225 - 16 + 96, eb, .25)

    @addElement 'city'

    h = 400 + 300
    @add(0, @level.visibleHeight - 100, Crafty.e('2D, WebGL, Color, SunBlock').attr(w: @delta.x, h: h, z: -10).color('#505050'))

levelGenerator.defineBlock class extends CityScenery
  name: 'City.Skyline2'
  delta:
    x: 1024
    y: 0

  generate: ->
    super
    @addElement 'cityFront'
    @addElement 'cityFront', 4, 512, 'bigBuildingBottom2'

    @addElement 'water'
    @addElement 'cityDistance'

    @addElement 'city'

    h = 160
    @add(0, @level.visibleHeight - 100, Crafty.e('2D, WebGL, Color, SunBlock').attr(w: @delta.x, h: h, z: -25).color('#555'))
    h2 = 10
    @add(0, @level.visibleHeight - 100 + h, Crafty.e('2D, WebGL, Color, SunBlock').attr(w: @delta.x, h: h2, z: -25).color('#777'))
    h3 = 400
    @add(0, @level.visibleHeight - 100 + h + h2, Crafty.e('2D, WebGL, Color, SunBlock').attr(w: @delta.x, h: h3, z: -25).color('#333'))
    h3 = 40
    @add(0, @level.visibleHeight + 170 - h3, Crafty.e('2D, Solid').attr(w: @delta.x, h: h3, z: 2))

levelGenerator.defineBlock class extends LevelScenery
  name: 'City.TrainTunnel'
  delta:
    x: 1024
    y: 0

  generate: ->
    super

    h = 150
    @add(0, @level.visibleHeight - 100, Crafty.e('2D, WebGL, Color, SunBlock, Solid').attr(w: @delta.x, h: h, z: -10).color('#505050'))
    h2 = 400
    @add(0, @level.visibleHeight - 100 + h, Crafty.e('2D, WebGL, Color, SunBlock').attr(w: @delta.x, h: h2, z: -10).color('#202020'))
    h = 150
    @add(0, @level.visibleHeight - 100 + h + h2, Crafty.e('2D, WebGL, Color, Solid, SunBlock').attr(w: @delta.x, h: h + h2, z: -10).color('#505050'))

levelGenerator.defineBlock class extends LevelScenery
  name: 'City.SmallerTrainTunnel'
  delta:
    x: 1024
    y: 0

  generate: ->
    super
    h = 250
    @add(0, @level.visibleHeight - 100, Crafty.e('2D, WebGL, Color, SunBlock, Solid').attr(w: @delta.x, h: h, z: -10).color('#505050'))
    h2 = 300
    @add(0, @level.visibleHeight - 100 + h, Crafty.e('2D, WebGL, Color, SunBlock').attr(w: @delta.x, h: h2, z: -10).color('#202020'))
    h3 = 350
    @add(0, @level.visibleHeight - 100 + h + h2, Crafty.e('2D, WebGL, Color, Solid, SunBlock').attr(w: @delta.x, h: h3, z: -10).color('#505050'))

