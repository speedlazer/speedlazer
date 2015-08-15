
# Import
generator = @Game.levelGenerator

generator.defineBlock class extends @Game.LevelBlock
  name: 'City.Intro'
  delta:
    x: 640
    y: 0
  next: ['City.Ocean']

  generate: ->
    super

    @add(0, @level.visibleHeight - 200, Crafty.e('2D, Canvas, Color').color('#202020').attr({ z: -1, w: 400, h: 200 }))

    @add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 350, h: 15 }))
    @add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 70 }))
    @add(450, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 550, h: 25 }))


    @addBackground(0, @level.visibleHeight - 65, Crafty.e('2D, Canvas, Color').color('#3030B0').attr({ z: -2, w: @delta.x * .5, h: 65 }), .5)
    @addBackground(0, @level.visibleHeight - 85, Crafty.e('2D, Canvas, Color').color('#6060E0').attr({ z: -3, w: @delta.x * .25, h: 85 }), .25)

    @addBackground(200, 45, Crafty.e('2D, Canvas, Color').color('#FFFFFF').attr({ z: -2, w: 100, h: 25 }), .5)
    @addBackground(200, 55, Crafty.e('2D, Canvas, Color').color('#DDDDDD').attr({ z: -3, w: 75, h: 25 }), .45)

  inScreen: ->
    @bind 'ShipSpawned', (ship) ->



    #if @level._forcedSpeed?.x?
      #@_speedX = @level._forcedSpeed?.x
    #else
      #@_speedX = @level._forcedSpeed

    #yFactor = @yMotion / (@delta.x - 640)
    #@level.setForcedSpeed(x: @_speedX, y: @_speedX * yFactor)

  outScreen: ->
    #@level.setForcedSpeed(@_speedX)

generator.defineBlock class extends @Game.LevelBlock
  name: 'City.Ocean'
  delta:
    x: 640
    y: 0
  next: ['City.Ocean']

  generate: ->
    super
    height = 25
    @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Edge, Color').attr(w: @delta.x, h: height).color('#000080'))
    @addBackground(0, @level.visibleHeight - 65, Crafty.e('2D, Canvas, Color').color('#3030B0').attr({ z: -2, w: @delta.x * .5, h: 65 }), .5)
    @addBackground(0, @level.visibleHeight - 85, Crafty.e('2D, Canvas, Color').color('#6060E0').attr({ z: -3, w: @delta.x * .25, h: 85 }), .25)

    @addBackground(200, 45, Crafty.e('2D, Canvas, Color').color('#FFFFFF').attr({ z: -2, w: 100, h: 25 }), .5)
    @addBackground(200, 55, Crafty.e('2D, Canvas, Color').color('#DDDDDD').attr({ z: -3, w: 75, h: 25 }), .45)
