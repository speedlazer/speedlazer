generator = @Game.levelGenerator

generator.defineBlock class extends @Game.LevelScenery
  name: 'City.Blackness'
  delta:
    x: 600
    y: 0

  generate: ->
    super

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

