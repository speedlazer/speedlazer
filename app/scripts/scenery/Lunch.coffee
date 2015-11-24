generator = @Game.levelGenerator

generator.defineElement 'waterHorizonOld', ->
  @addBackground(0, @level.visibleHeight - 155, Crafty.e('2D, Canvas, Color').color('#6060E0').attr({ z: -600, w: (@delta.x * .25) + 1, h: 155 }), .25)

  goldenStripe = Crafty.e('2D, Canvas, Color, GoldenStripe').color('#DDDD00').attr(z: -599, w: (@delta.x * .25), h: 1, alpha: 0)
  @addBackground(0, @level.visibleHeight - 155, goldenStripe, .25)

generator.defineElement 'waterFrontOld', ->
  height = 65
  @add(0, @level.visibleHeight - 10, Crafty.e('2D, Solid').attr(w: @delta.x, h: 10))
  @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Color').attr(w: @delta.x, h: height, z: -300).color('#000080'))

generator.defineElement 'waterOld', ->
  @addBackground(0, @level.visibleHeight - 125, Crafty.e('2D, Canvas, Color').color('#3030B0').attr({ z: -500, w: (@delta.x * .5) + 1, h: 105 }), .5)
  @addBackground(0, @level.visibleHeight - 90, Crafty.e('2D, Canvas, Color').color('#3030B0').attr({ z: -301, w: (@delta.x * .5) + 1, h: 70 }), .5)

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.Blackness'
  delta:
    x: 600
    y: 0

  generate: ->
    super

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.OceanOld'
  delta:
    x: 800
    y: 0

  generate: ->
    super

    @addElement 'waterFrontOld'
    @addElement 'waterHorizonOld'
    @addElement 'cloud'
    @addElement 'waterOld'

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.OpenSpace'
  delta:
    x: 400
    y: 0

  generate: ->
    super
    @add(0, 150, Crafty.e('2D, Canvas, Solid, Color').color('#505045').attr({ w: 42, h: 70 }))
    @add(500, 50, Crafty.e('2D, Canvas, Solid, Color').color('#404045').attr({ w: 82, h: 70 }))
    @add(200, 250, Crafty.e('2D, Canvas, Solid, Color').color('#505045').attr({ w: 52, h: 80 }))
    @add(100, 450, Crafty.e('2D, Canvas, Solid, Color').color('#505045').attr({ w: 52, h: 40 }))
    @add(400, 550, Crafty.e('2D, Canvas, Solid, Color').color('#404040').attr({ w: 82, h: 30 }))

