
# Import
generator = @Game.levelGenerator
Game = @Game

generator.defineElement 'cloud', ->
  v = Math.random()
  blur = (Math.random() * 4.0)
  if v > .2
    y = (Math.random() * 20) + 100
    w = (Math.random() * 20) + 125
    h = (Math.random() * 10) + 50
    c1 = Crafty.e('2D, WebGL, cloud, Hideable, Horizon').attr(
      z: -200,
      w: w,
      h: h,
      topDesaturation: 0.6,
      bottomDesaturation: 0.6
      alpha: (Math.random() * 0.8) + 0.2
      blur: blur
    )
    if Math.random() < 0.7
      c1 = c1.flip('X')
    @addBackground(200, y, c1, .5)

  if v < .6
    s = (Math.random() * .20) + .25

    y = 230 - (s * 50)
    w = ((Math.random() * 10) + 70) - (s * 20)
    h = ((Math.random() * 5) + 20) - (s * 10)
    c2 = Crafty.e('2D, WebGL, cloud, Hideable, Horizon').attr(
      z: -250 + (s * 20),
      w: w,
      h: h,
      topDesaturation: 1.0 - s,
      bottomDesaturation: 1.0 - s
      alpha: (Math.random() * 0.8) + 0.2
      blur: blur
    )
    if Math.random() < 0.2
      c2 = c2.flip('X')
    @addBackground(300, y, c2, s)

generator.defineElement 'waterHorizon', ->
  h = Crafty.e('2D, WebGL, waterHorizon, SunBlock, Horizon')
    .attr(z: -600)
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(1.0, .0)
  @addBackground(0, @level.visibleHeight - 175, h, .25)

  goldenStripe = Crafty.e('2D, WebGL, Gradient, GoldenStripe')
    .topColor('#DDDD00')
    .bottomColor('#DDDD00', 0)
    .attr(z: -599, w: (@delta.x * .25), h: 1, alpha: 0)
  @addBackground(0, @level.visibleHeight - 175, goldenStripe, .25)

generator.defineElement 'water', ->
  h = Crafty.e('2D, WebGL, waterMiddle, Horizon, ColorEffects')
    .attr(z: -500)
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.7, .0)
  @addBackground(0, @level.visibleHeight - 125, h, .5)

  @level.registerWaveTween 'OceanWavesMiddle', 5500, 'easeInOutQuad', (v, forward) ->
    moveh = 5
    distanceh = 15
    height = 105
    Crafty('waterMiddle').each ->
      if forward
        @dy = (v * moveh)
        @h = height - (v * distanceh)
      else
        @dy = moveh - (v * moveh)
        @h = height - distanceh + (v * distanceh)

generator.defineElement 'waterFront', (attrs = {}) ->
  height = 65
  @add(0, @level.visibleHeight - 10, Crafty.e('2D, Solid').attr(w: @delta.x, h: 10))

  water1 = Crafty.e('2D, WebGL, waterFront1, Wave1').attr(z: -20).attr(attrs)
  @add(0, @level.visibleHeight - height, water1)
  water1.originalY = water1.y

  water2 = Crafty.e('2D, WebGL, waterFront2, Wave2').attr(z: -20).attr(attrs)
  @add(400, @level.visibleHeight - height, water2)
  water2.originalX = water2.x
  water2.originalY = water2.y

  @level.registerWaveTween 'OceanWaves', 6000, 'easeInOutQuad', (v, forward) ->
    distance = 50
    distanceh = 40
    moveh = 5
    width = 400
    height = 125
    Crafty('Wave1').each ->
      if forward
        @w = width + (v * distance)
        @y = @originalY + (v * moveh)
        @h = height - (v * distanceh)
      else
        @w = width + distance - (v * distance)
        @y = @originalY + moveh - (v * moveh)
        @h = height - distanceh + (v * distanceh)
    Crafty('Wave2').each ->
      if forward
        @w = width - (v * distance)
        @x = @originalX + (v * distance)
        @y = @originalY + (v * moveh)
        @h = height - (v * distanceh)
      else
        @w = width - distance + (v * distance)
        @x = @originalX + distance - (v * distance)
        @y = @originalY + moveh - (v * moveh)
        @h = height - distanceh + (v * distanceh)

generator.defineElement 'cityHorizon', (mode) ->
  @addElement 'waterHorizon'
  e = if mode is 'start'
    Crafty.e('2D, WebGL, ColorEffects, coastStart, SunBlock, Horizon')
  else
    Crafty.e('2D, WebGL, ColorEffects, coast, SunBlock, Horizon')
  e.attr(z: -598, blur: 2.0)
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.9, .8)
  @addBackground(0, @level.visibleHeight - 177, e, .25)

generator.defineElement 'city', ->
  #col3 = '#66667D'
  #@addBackground(0, @level.visibleHeight - 140, Crafty.e('2D, WebGL, Color').color(col3).attr(z: -400, w: 297, h: 83), .37)

  bg = Crafty.e('2D, WebGL, cityLayer2, Collision, SunBlock, Horizon')
    .attr(z: -505, blur: 1.2)
    .collision([4, 29, 72, 29, 72, 118, 4, 118])
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.6, .6)
  @addBackground(0, @level.visibleHeight - 57 - 240, bg, .37)

  e = Crafty.e('2D, WebGL, city, Collision, SunBlock, Horizon')
    .attr(z: -305)
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.4, .4)
  e.collision([35, 155, 35, 0, 130, 0, 130, 155])

  c = Crafty.e('2D, Collision, SunBlock')
  c.attr(w: e.w, h: e.h)
  c.collision([20, 155, 0, 80, 20, 20, 70, 20, 70, 155])

  @addBackground(0, @level.visibleHeight - 290, e, .5)
  @addBackground(400, @level.visibleHeight - 290, c, .5)

generator.defineElement 'city-bridge', ->
  bg = Crafty.e('2D, WebGL, cityLayer2, Collision, SunBlock, Horizon')
    .attr(z: -505, blur: 1.2)
    .collision([4, 29, 72, 29, 72, 118, 4, 118])
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.6, .6)
  @addBackground(0, @level.visibleHeight - 57 - 240, bg, .37)

  e = Crafty.e('2D, WebGL, cityBridge, Collision, Horizon')
    .attr(z: -305)
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.4, .4)
  e.collision([35, 155, 35, 0, 130, 0, 130, 155])

  @addBackground(0, @level.visibleHeight - 290, e, .5)

generator.defineElement 'cityStart', ->
  e = Crafty.e('2D, WebGL, cityStart, Collision, SunBlock, Horizon')
    .attr(z: -305)
    .colorDesaturation(Game.backgroundColor)
    .saturationGradient(.4, .4)
  e.collision([220, 155, 220, 20, 270, 20, 270, 0, 330, 0, 330, 155])
  @addBackground(0, @level.visibleHeight - 290, e, .5)

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.Intro'
  delta:
    x: 800
    y: 0
  autoNext: 'Ocean'

  generate: ->
    super

    shipLength = 700

    #height = 65
    #@add(0, @level.visibleHeight - 10, Crafty.e('2D, WebGL, Solid, Color').attr(w: @delta.x, h: 90).color('#000080'))
    #@add(0, @level.visibleHeight - height, Crafty.e('2D, WebGL, Color').attr(w: @delta.x, h: height + 10, z: -300).color('#000080'))
    @addElement 'waterFront'

    height = 45
    shipHeight = 155
    cabinHeight = 150

    @add(0, @level.visibleHeight - height - shipHeight, Crafty.e('2D, WebGL, Color').color('#202020').attr(z: -23, w: shipLength, h: shipHeight))
    @add(50, @level.visibleHeight - height - shipHeight - cabinHeight, Crafty.e('2D, WebGL, Color').color('#202020').attr(z: -23, w: 350, h: cabinHeight))

    @elevator = Crafty.e('2D, WebGL, Color, Tween').color('#707070').attr(z: -22, w: 100, h: 5)
    @add(140, @level.visibleHeight - 70, @elevator)

    @outside = Crafty.e('2D, WebGL, Color, Tween').color('#303030').attr(z: -21, w: shipLength + 10, h: shipHeight - 5, alpha: 0)
    @add(0, @level.visibleHeight - @outside.h - height, @outside)

    barrelLocator = Crafty.e('2D, BarrelLocation')
    @add(500, @level.visibleHeight - @outside.h - height, barrelLocator)

    @addElement 'water'
    @addElement 'waterHorizon'

    @addBackground(0, @level.visibleHeight + 30, Crafty.e('2D, WebGL, Color').color('#000040').attr(z: 3, w: ((@delta.x + Crafty.viewport.width * .5)) + 1, h: 185), 1.25)

    @addElement 'cloud'

  enter: ->
    super
    @speed = @level._forcedSpeed
    Crafty('ScrollWall').attr y: 120
    @level.setForcedSpeed 0
    c = [
        type: 'linear'
        x: -160
        duration: 2500
      ,
        type: 'linear'
        y: -130
        duration: 2500
        event: 'lift'
      ,
        type: 'linear'
        x: 70
        y: -10
        duration: 2500
        event: 'shipExterior'
      ,
        type: 'delay'
        duration: 500
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
      newShip.attr(x: leadAnimated.x - 50, y: leadAnimated.y)
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
      @attr x: 360 - (50 * index), y: Crafty.viewport.height - 100
      @disableControl()
      @weaponsEnabled = no
      @choreography c
      @one 'ChoreographyEnd', =>
        @removeComponent 'Choreography', 'no'
        block.unbind 'ShipSpawned'
      @one 'unlock', ->
        @enableControl()
        @weaponsEnabled = yes
      @one 'lift', ->
        block.elevator.tween({ y: block.elevator.y - 130 }, 2500)
        Crafty('ScrollWall').each ->
          @addComponent 'Tween'
          @tween { y: 0 }, 5000
          @one 'TweenEnd', -> @removeComponent 'Tween', no
      @one 'shipExterior', ->
        block.outside.tween({ alpha: 1 }, 1500).addComponent('Solid')
      @one 'go', ->
        block.level.setForcedSpeed block.speed

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.Ocean'
  delta:
    x: 800
    y: 0

  assets: ->
    sprites:
      'water-horizon.png':
        tile: 201
        tileh: 155
        map:
          waterHorizon: [0, 0]
      'water.png':
        tile: 400
        tileh: 105
        map:
          waterMiddle: [0, 0]
      'water-front.png':
        tile: 400
        tileh: 90
        map:
          waterFront1: [0, 0]
          waterFront2: [1, 0]

  generate: ->
    super

    @addElement 'cloud'
    @addElement 'waterHorizon'
    @addElement 'water'
    @addElement 'waterFront'

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.CoastStart'
  delta:
    x: 800
    y: 0
  autoNext: 'Coast'
  autoPrevious: 'Ocean'

  assets: ->
    sprites:
      'horizon-city.png':
        tile: 200
        tileh: 30
        paddingY: 1
        map:
          coastStart: [0, 0]
          coast: [0, 1]

  generate: ->
    super
    @addElement 'cloud'
    @addElement 'cityHorizon', 'start'
    @addElement 'water'
    @addElement 'waterFront'

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.Coast'
  delta:
    x: 800
    y: 0

  assets: ->
    sprites:
      'water-horizon.png':
        tile: 201
        tileh: 155
        map:
          waterHorizon: [0, 0]
      'water.png':
        tile: 400
        tileh: 105
        map:
          waterMiddle: [0, 0]
      'water-front.png':
        tile: 400
        tileh: 90
        map:
          waterFront1: [0, 0]
          waterFront2: [1, 0]
      'horizon-city.png':
        tile: 200
        tileh: 30
        paddingY: 1
        map:
          coastStart: [0, 0]
          coast: [0, 1]

  generate: ->
    super
    @addElement 'waterFront'
    @addElement 'cityHorizon'
    @addElement 'water'
    @addElement 'cloud'

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.BayStart'
  delta:
    x: 800
    y: 0
  autoNext: 'Bay'
  autoPrev: 'Coast'

  generate: ->
    super
    @addElement 'cityHorizon'
    @addElement 'water'
    @addElement 'waterFront'
    @addElement 'cityStart'

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.Bay'
  delta:
    x: 800
    y: 0

  assets: ->
    sprites:
      'water-horizon.png':
        tile: 201
        tileh: 155
        map:
          waterHorizon: [0, 0]
      'water.png':
        tile: 400
        tileh: 105
        map:
          waterMiddle: [0, 0]
      'water-front.png':
        tile: 400
        tileh: 90
        map:
          waterFront1: [0, 0]
          waterFront2: [1, 0]
      'horizon-city.png':
        tile: 200
        tileh: 30
        paddingY: 1
        map:
          coastStart: [0, 0]
          coast: [0, 1]
      'city.png':
        tile: 402
        tileh: 270
        paddingY: 1
        map:
          cityBridge: [0, 0]
          cityStart: [0, 1]
          city: [0, 2]
      'city-layer2.png':
        tile: 297
        tileh: 220
        map:
          cityLayer2: [0, 0]

  generate: ->
    super
    @addElement 'waterFront'
    @addElement 'water'
    @addElement 'cityHorizon'
    @addElement 'city'

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.UnderBridge'
  delta:
    x: 800
    y: 0
  autoNext: 'Bay'

  assets: ->
    sprites:
      'bridge-deck.png':
        tile: 1
        tileh: 1
        map:
          bridgeDeck: [0, 0, 1024, 180]
          bridgePillar: [0, 181, 534, 180]

  generate: ->
    super
    @notifyOffsetX = -100

    @addElement 'waterFront', lightness: 0.8
    @addElement 'water'
    @addElement 'cityHorizon'
    @addElement 'city-bridge'

    bridgeWidth = Crafty.viewport.width
    height = Crafty.viewport.height * 1.1

    # 2 front pillars

    @addBackground(0, 345,  @deck(.55, w: 550, z: -280), .55)
    @addBackground(0, 305,  @deck(.45, w: 600, z: -270).flip('X'), .60)
    @addBackground(0, 255,  @deck(.35, w: 650, z: -260), .65)

    @addBackground(140, 290,  @pillar( .35, h: 200, z: -261), .65)
    @addBackground(970, 290,  @pillarX(.35, h: 200, z: -261), .65)

    @addBackground(0, 205,  @deck(.25, w: 700, z: -50).flip('X'), .70)
    @addBackground(0, 155,  @deck(.15, w: 750, z: -40), .75)

    @addBackground(160, 160, @pillar( 0, h: 350, z: -31), .8)
    @addBackground(990, 160, @pillarX(0, h: 350, z: -31), .8)
    @addBackground(0, 95,  @deck(.05, w: 800, z: -30).flip('X'), .8)

    @addBackground(0, 20,   @deck(0,   w: 900, z: -20), .9)

    @addBackground(0, -60,  @deck(0,   w: 1000, z: -10).flip('X'), 1.0)
    @addBackground(0, -180, @deck(0,   w: 1200, z: 100, lightness: 0.6, blur: 6.0), 1.2)

    @addBackground(190,  -60, @pillar( 0, h: 750, z: 80, lightness: 0.6, blur: 6.0), 1.2)
    @addBackground(1025, -60, @pillarX(0, h: 750, z: 80, lightness: 0.6, blur: 6.0), 1.2)



  deck: (gradient, attr) ->
    aspectR = 1024 / 180
    attr.h = attr.w / aspectR
    Crafty.e('2D, WebGL, bridgeDeck, ColorEffects, Horizon, SunBlock').attr(
      attr
    ).saturationGradient(gradient, gradient)

  pillar: (gradient, attr) ->
    aspectR = 534 / 170
    attr.w = attr.h
    attr.h = attr.w / aspectR
    attr.rotation = 90
    Crafty.e('2D, WebGL, bridgePillar, ColorEffects, Horizon, SunBlock').attr(
      attr
    ).saturationGradient(gradient, gradient)

  pillarX: (gradient, attr) ->
    @pillar(gradient, attr).flip('Y')


generator.defineBlock class extends @Game.LevelScenery
  name: 'City.Skyline'
  delta:
    x: 800
    y: 0

  assets: ->
    sprites:
      'city-layer2.png':
        tile: 297
        tileh: 220
        map:
          cityLayer2: [0, 0]
      'city.png':
        tile: 402
        tileh: 270
        paddingY: 1
        map:
          city: [0, 0]
      'water-horizon.png':
        tile: 201
        tileh: 155
        map:
          waterHorizon: [0, 0]

  generate: ->
    super
    h = 400 + 200
    @add(0, @level.visibleHeight - h, Crafty.e('2D, WebGL, Color').attr(w: 600, h: h, z: -10).color('#909090'))

    h = 300 + 200
    @addBackground(200, @level.visibleHeight - h, Crafty.e('2D, WebGL, Color').attr(w: 700, h: h, z: 5).color('#000000'), 1.5)

    @addElement 'water'

    @addElement 'cityHorizon'
    @addElement 'city'

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.SkylineBase'
  delta:
    x: 800
    y: 0
  autoNext: 'Skyline2'

  assets: ->
    sprites:
      'city-layer2.png':
        tile: 297
        tileh: 220
        map:
          cityLayer2: [0, 0]
      'city.png':
        tile: 402
        tileh: 270
        paddingY: 1
        map:
          city: [0, 0]

  generate: ->
    super
    h = 400 + 200
    @add(0, @level.visibleHeight - h, Crafty.e('2D, WebGL, Color, SunBlock').attr(w: 600, h: h, z: -10).color('#909090'))

    e = Crafty.e('2D, WebGL, MiliBase, Color').color('#805050').attr(w: 200, h: 400, z: -598)
    @addBackground(0, @level.visibleHeight - 177, e, .25)

    @addElement 'city'

    h = 400 + 300
    @add(0, @level.visibleHeight - 100, Crafty.e('2D, WebGL, Color, SunBlock').attr(w: @delta.x, h: h, z: -10).color('#505050'))

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.Skyline2'
  delta:
    x: 800
    y: 0

  assets: ->
    sprites:
      'city-layer2.png':
        tile: 297
        tileh: 220
        map:
          cityLayer2: [0, 0]
      'city.png':
        tile: 402
        tileh: 270
        paddingY: 1
        map:
          city: [0, 0]
      'water-horizon.png':
        tile: 201
        tileh: 155
        map:
          waterHorizon: [0, 0]

  generate: ->
    super
    h = 400 + 200
    @add(0, @level.visibleHeight - h, Crafty.e('2D, WebGL, Color, SunBlock').attr(w: 600, h: h, z: -10).color('#909090'))

    @addElement 'water'

    @addElement 'cityHorizon'
    @addElement 'city'

    h = 400 + 300
    @add(0, @level.visibleHeight - 100, Crafty.e('2D, WebGL, Color, SunBlock').attr(w: @delta.x, h: h, z: -10).color('#505050'))

