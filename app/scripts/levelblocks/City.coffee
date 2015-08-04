
# Import
generator = @Game.levelGenerator

generator.defineBlock class extends @Game.LevelBlock
  name: 'City.Ocean'
  delta:
    x: 640
    y: 0
  next: ['City.Ocean']

  generate: ->
    height = 25
    @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Edge, Color').attr(w: @delta.x, h: height).color('#000080'))
    @addBackground(0, @level.visibleHeight - 65, Crafty.e('2D, Canvas, Color').color('#3030B0').attr({ z: -2, w: @delta.x * .5, h: 65 }), .5)
    @addBackground(0, @level.visibleHeight - 85, Crafty.e('2D, Canvas, Color').color('#6060E0').attr({ z: -3, w: @delta.x * .25, h: 85 }), .25)

    @addBackground(200, 45, Crafty.e('2D, Canvas, Color').color('#FFFFFF').attr({ z: -2, w: 100, h: 25 }), .5)
    @addBackground(200, 55, Crafty.e('2D, Canvas, Color').color('#DDDDDD').attr({ z: -3, w: 75, h: 25 }), .45)

  inScreen: ->
    only = @settings.only || []
    #if only.indexOf('cleared') is -1
      #@spawnEnemies()

  spawnEnemies: ->
    c = [
      length: 1
      x: 620
      y: 150
      duration: 2000
      type: 'viewport'
    ]

    Crafty.e('Delay').delay(
      =>
        e = Crafty.e('Enemy')
        e.bind('retreat', (data) -> console.log "Retreating! #{data.data.name}")
        @add(750, 150, e)
        e.enemy().choreography(c, 1)
    , 500, 1)
