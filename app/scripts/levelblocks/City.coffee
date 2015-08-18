
# Import
generator = @Game.levelGenerator

generator.defineBlock class extends @Game.LevelBlock
  name: 'City.Intro'
  delta:
    x: 800
    y: 0
  next: ['City.Ocean']

  generate: ->
    super

    shipLength = 700

    height = 25
    @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Edge, Color').attr(w: @delta.x, h: height + 80).color('#000080'))

    @add(0, @level.visibleHeight - 200, Crafty.e('2D, Canvas, Color').color('#202020').attr({ z: -1, w: shipLength, h: 300 }))
    @add(50, @level.visibleHeight - 350, Crafty.e('2D, Canvas, Color').color('#202020').attr({ z: -1, w: 350, h: 150 }))
    @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Color').color('#202020').attr({ z: 3, w: shipLength, h: 70, alpha: 0.3 }))

    @outside = Crafty.e('2D, Canvas, Color, Tween').color('#303030').attr({ z: 0, w: shipLength + 10, h: 195 - height, alpha: 0 })
    @add(0, @level.visibleHeight - @outside.h - height, @outside)

    @barrel = Crafty.e('2D, Tween, Canvas, Color, Collision, Choreography').color('#606000').attr({ z: 3, w: 10, h: 15 })
    @add(500, @level.visibleHeight - @outside.h - height - @barrel.h, @barrel)

    @splash = Crafty.e('2D, Tween, Canvas, Color').color('#E0E0E0').attr({ z: 3, w: 10, h: 1, alpha: 0 })
    @add(485, @level.visibleHeight - height + 10, @splash)

    @barrelKnock = no
    knockOff = [
        type: 'linear'
        y: 190
        duration: 1500
      ,
        type: 'delay'
        event: 'splash'
        duration: 1
    ]
    @barrel.onHit 'PlayerControlledShip', =>
      return if @barrelKnock
      @barrelKnock = yes
      @barrel.choreography(knockOff).tween(rotation: 90, 1500).one 'splash', =>
        @barrel.attr alpha: 0
        @splash.attr(alpha: 1).tween(alpha: 0, w: 30, x: @splash.x - 10, h: 30, y: @splash.y - 30, 750)


    @addBackground(-600, @level.visibleHeight - 65, Crafty.e('2D, Canvas, Color').color('#3030B0').attr({ z: -2, w: ((@delta.x + 600) * .5) + 1, h: 65 }), .5)
    @addBackground(-300, @level.visibleHeight - 85, Crafty.e('2D, Canvas, Color').color('#6060E0').attr({ z: -3, w: ((@delta.x + 300) * .25) + 1, h: 85 }), .25)

    @addBackground(0, @level.visibleHeight + 40, Crafty.e('2D, Canvas, Color').color('#000040').attr({ z: 3, w: ((@delta.x + 300)) + 1, h: 185 }), 1.25)

    @addBackground(200, 45, Crafty.e('2D, Canvas, Color').color('#FFFFFF').attr({ z: -2, w: 100, h: 25 }), .5)
    @addBackground(200, 55, Crafty.e('2D, Canvas, Color').color('#DDDDDD').attr({ z: -3, w: 75, h: 25 }), .45)

  enter: ->
    super
    c = [
        type: 'linear'
        x: -160
        duration: 5500
      ,
        type: 'linear'
        y: -160
        duration: 5500
        event: 'lift'
      ,
        type: 'linear'
        x: 60
        duration: 3500
        event: 'shipExterior'
    ]
    block = this
    Crafty('PlayerControlledShip').each (index) ->
      @addComponent 'Choreography'
      @attr x: 360 - (50 * index), y: 400
      @disableControl()
      @choreography c
      @one 'ChoreographyEnd', =>
        @enableControl()
        @removeComponent 'ChoreographyEnd', no
      @one 'lift', ->
        Crafty('ScrollWall').each ->
          @addComponent 'Tween'
          @tween { y: 0 }, 7500
          @one 'TweenEnd', -> @removeComponent 'Tween', no
      @one 'shipExterior', ->
        block.outside.tween({ alpha: 1 }, 3500).addComponent('Edge')


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
    @addBackground(0, @level.visibleHeight - 65, Crafty.e('2D, Canvas, Color').color('#3030B0').attr({ z: -2, w: (@delta.x * .5) + 1, h: 65 }), .5)
    @addBackground(0, @level.visibleHeight - 85, Crafty.e('2D, Canvas, Color').color('#6060E0').attr({ z: -3, w: (@delta.x * .25) + 1, h: 85 }), .25)

    @addBackground(200, 45, Crafty.e('2D, Canvas, Color').color('#FFFFFF').attr({ z: -2, w: 100, h: 25 }), .5)
    @addBackground(200, 55, Crafty.e('2D, Canvas, Color').color('#DDDDDD').attr({ z: -3, w: 75, h: 25 }), .45)
