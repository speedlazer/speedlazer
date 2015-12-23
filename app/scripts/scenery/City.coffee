
# Import
generator = @Game.levelGenerator

generator.defineElement 'cloud', ->
  y = (Math.random() * 20) + 40
  @addBackground(200, y, Crafty.e('2D, WebGL, Color').color('#FFFFFF').attr(z: -200, w: 100, h: 25, alpha: 0.5), .5)
  y = (Math.random() * 20) + 130
  @addBackground(300, y, Crafty.e('2D, WebGL, Color').color('#FFFFFF').attr(z: -200, w: 70, h: 20, alpha: 0.3), .35)

generator.defineElement 'waterHorizon', ->
  @addBackground(0, @level.visibleHeight - 175, Crafty.e('2D, WebGL, Image').image('images/water-horizon.png').attr(z: -600), .25)

  goldenStripe = Crafty.e('2D, WebGL, Color, GoldenStripe').color('#DDDD00').attr(z: -599, w: (@delta.x * .25), h: 1, alpha: 0)
  @addBackground(0, @level.visibleHeight - 175, goldenStripe, .25)

generator.defineElement 'water', ->
  @addBackground(0, @level.visibleHeight - 125, Crafty.e('2D, WebGL, water1').attr(z: -500), .5)
  water2 = Crafty.e('2D, WebGL, water2').attr(z: -500)
  @addBackground(400, @level.visibleHeight - 125, water2, .5)
  water2.originalX = water2.x

  @level.registerWaveTween 'OceanWavesDistance', 5000, 'easeInOutQuad', (v, forward) ->
    distance = 20
    width = 200
    Crafty('water1').each ->
      if forward
        @w = width + (v * distance)
      else
        @w = width + distance - (v * distance)
    Crafty('water2').each ->
      if forward
        @w = width - (v * distance) + 1
        @dx = (v * distance) - 1
      else
        @w = width - distance + (v * distance) + 1
        @dx = distance - (v * distance) - 1

generator.defineElement 'waterFront', ->
  height = 65
  @add(0, @level.visibleHeight - 10, Crafty.e('2D, Solid').attr(w: @delta.x, h: 10))

  water1 = Crafty.e('2D, WebGL, waterFront1, Wave1').attr(z: -300)
  @add(0, @level.visibleHeight - height, water1)
  water1.originalY = water1.y

  water2 = Crafty.e('2D, WebGL, waterFront2, Wave2').attr(z: -300)
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
  if mode is 'start'
    e = Crafty.e('2D, WebGL, Image').image('images/horizon-city-start.png').attr(z: -598)
    @addBackground(0, @level.visibleHeight - 177, e, .25)
  else
    e = Crafty.e('2D, WebGL, Image').image('images/horizon-city.png').attr(z: -598)
    @addBackground(0, @level.visibleHeight - 177, e, .25)

generator.defineElement 'city', ->
  #col3 = '#66667D'
  #@addBackground(0, @level.visibleHeight - 140, Crafty.e('2D, WebGL, Color').color(col3).attr(z: -400, w: 297, h: 83), .37)

  bg =Crafty.e('2D, WebGL, Image, Collision')
    .image('images/city-layer2.png').attr(z: -400)
    .collision([4, 29, 72, 29, 72, 118, 4, 118])
  @addBackground(0, @level.visibleHeight - 57 - 240, bg, .37)

  e = Crafty.e('2D, WebGL, Image, Collision').image('images/city.png').attr(z: -305)
  e.collision([35, 155, 35, 0, 130, 0, 130, 155])

  c = Crafty.e('2D, Collision')
  c.attr(w: e.w, h: e.h)
  c.collision([20, 155, 0, 80, 20, 20, 70, 20, 70, 155])

  @addBackground(0, @level.visibleHeight - 290, e, .5)
  @addBackground(400, @level.visibleHeight - 290, c, .5)

generator.defineElement 'city-bridge', ->
  bg =Crafty.e('2D, WebGL, Image, Collision')
    .image('images/city-layer2.png').attr(z: -400)
    .collision([4, 29, 72, 29, 72, 118, 4, 118])
  @addBackground(0, @level.visibleHeight - 57 - 240, bg, .37)

  e = Crafty.e('2D, WebGL, Image, Collision').image('images/city-bridge.png').attr(z: -305)
  e.collision([35, 155, 35, 0, 130, 0, 130, 155])

  @addBackground(0, @level.visibleHeight - 290, e, .5)

generator.defineElement 'cityStart', ->
  e = Crafty.e('2D, WebGL, Image, Collision').image('images/city-start.png').attr(z: -305)
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

    @add(0, @level.visibleHeight - height - shipHeight, Crafty.e('2D, WebGL, Color').color('#202020').attr(z: -1, w: shipLength, h: shipHeight))
    @add(50, @level.visibleHeight - height - shipHeight - cabinHeight, Crafty.e('2D, WebGL, Color').color('#202020').attr(z: -1, w: 350, h: cabinHeight))

    # Shadow on the water
    @add(0, @level.visibleHeight - height, Crafty.e('2D, WebGL, Color').color('#202020').attr(z: 3, w: shipLength, h: 70, alpha: 0.3))


    @elevator = Crafty.e('2D, WebGL, Color, Tween').color('#707070').attr(z: 0, w: 100, h: 5)
    @add(140, @level.visibleHeight - 70, @elevator)

    @outside = Crafty.e('2D, WebGL, Color, Tween').color('#303030').attr(z: 0, w: shipLength + 10, h: shipHeight - 5, alpha: 0)
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
      return unless index is 0
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
    images: ['water-horizon.png']
    sprites:
      'water.png':
        tile: 200
        tileh: 105
        map:
          water1: [0, 0]
          water2: [1, 0]
      'water-front.png':
        tile: 400
        tileh: 90
        map:
          waterFront1: [0, 0]
          waterFront2: [1, 0]

  generate: ->
    super

    @addElement 'waterFront'
    @addElement 'waterHorizon'
    @addElement 'cloud'
    @addElement 'water'

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.CoastStart'
  delta:
    x: 800
    y: 0
  autoNext: 'Coast'

  assets: ->
    images: ['horizon-city-start.png']

  generate: ->
    super
    @addElement 'waterFront'
    @addElement 'water'
    @addElement 'cityHorizon', 'start'
    @addElement 'cloud'

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.Coast'
  delta:
    x: 800
    y: 0

  assets: ->
    images: ['horizon-city.png', 'water-horizon.png']
    sprites:
      'water.png':
        tile: 200
        tileh: 105
        map:
          water1: [0, 0]
          water2: [1, 0]
      'water-front.png':
        tile: 400
        tileh: 90
        map:
          waterFront1: [0, 0]
          waterFront2: [1, 0]

  generate: ->
    super
    @addElement 'waterFront'
    @addElement 'water'
    @addElement 'cityHorizon'
    @addElement 'cloud'

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.BayStart'
  delta:
    x: 800
    y: 0
  autoNext: 'Bay'

  assets: ->
    images: ['city-start.png']

  generate: ->
    super
    @addElement 'waterFront'
    @addElement 'water'
    @addElement 'cityHorizon'
    @addElement 'cityStart'

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.Bay'
  delta:
    x: 800
    y: 0

  assets: ->
    images: ['horizon-city.png', 'water-horizon.png', 'city.png', 'city-layer2.png']
    sprites:
      'water-front.png':
        tile: 400
        tileh: 90
        map:
          waterFront1: [0, 0]
          waterFront2: [1, 0]

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
    images: ['city-bridge.png']

  generate: ->
    super
    @addElement 'waterFront'
    @addElement 'water'
    @addElement 'cityHorizon'
    @addElement 'city-bridge'

    bridgeWidth = 640

    # Pillars
    pillarWidth = 80
    @addBackground(0, @level.visibleHeight - 480, Crafty.e('2D, WebGL, Color').color('#000000').attr({ z: 3, w: pillarWidth * 1.5, h: 480, alpha: 0.7 }), 1.5)
    @addBackground(bridgeWidth - pillarWidth, @level.visibleHeight - 480, Crafty.e('2D, WebGL, Color').color('#000000').attr({ z: 3, w: pillarWidth * 1.5, h: 480, alpha: 0.7 }), 1.5)

    # Deck
    for i in [0..11]
      c = ['#101010', '#181818', '#202020', '#282828', '#303030',
           '#383838', '#404040', '#484848', '#505050', '#585858', '#606060', '#686868'][11 - (i // 2)]
      h = 120 - (8 * i)
      y = @level.visibleHeight - (480 - (i * 30))
      z = -3 - (1 * i)
      sp = 1.2 - (0.05 * i)
      hp = (420 - (6 * i)) - (h + y)
      @addBackground(0, y, Crafty.e('2D, WebGL, Color').color(c).attr({ z: z, w: bridgeWidth * sp, h: h }), sp)
      if i % 5 is 0
        @addBackground(0, h + y, Crafty.e('2D, WebGL, Color').color(c).attr({ z: z, w: pillarWidth * sp, h: hp }), sp)
        @addBackground(bridgeWidth - pillarWidth, h + y, Crafty.e('2D, WebGL, Color').color(c).attr({ z: z, w: pillarWidth * sp, h: hp }), sp)


generator.defineBlock class extends @Game.LevelScenery
  name: 'City.Skyline'
  delta:
    x: 800
    y: 0

  assets: ->
    images: ['water-horizon.png', 'horizon-city.png', 'city.png', 'city-layer2.png']

  generate: ->
    super
    h = 400 + 200
    @add(0, @level.visibleHeight - h, Crafty.e('2D, WebGL, Color').attr(w: 300, h: h, z: -1).color('#909090'))

    h = 300 + 200
    @addBackground(200, @level.visibleHeight - h, Crafty.e('2D, WebGL, Color').attr(w: 400, h: h, z: 5).color('#000000'), 1.5)

    @addElement 'water'

    @addElement 'cityHorizon'
    @addElement 'city'

