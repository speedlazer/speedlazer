
# Import
generator = @Game.levelGenerator

generator.defineBlock class extends @Game.LevelBlock
  name: 'GameplayDemo.End'
  delta:
    x: 800
    y: 0
  next: []

  generate: ->
    h = 2
    @add(0, 0, Crafty.e('2D, Canvas, Edge, Color').attr(w: @delta.x, h: h))
    @add(0, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').attr(w: @delta.x, h: h))

  inScreen: ->
    Crafty('ScrollWall').each ->
      @off()
    endLevelTrigger = Crafty.e('2D, Canvas, Color, Collision')
      .attr({ w: 10, h: @level.visibleHeight })
      .onHit 'PlayerControlledShip', ->
        Crafty.trigger('EndOfLevel')
        @destroy()
    @add(640, 0, endLevelTrigger)


generator.defineBlock class extends @Game.LevelBlock
  name: 'GameplayDemo.Asteroids'
  delta:
    x: 1000
    y: 0
  next: ['GameplayDemo.Asteroids', 'GameplayDemo.TunnelStart']
  supports: ['speed', 'cleared']

  generate: ->
    height = 2
    @add(0, 0, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: height )
    @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: height )

    @add(400, 75, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr(w: 22, h: 35))
    @add(900, 25, Crafty.e('2D, Canvas, Edge, Color').color('#404045').attr(w: 42, h: 35))
    @add(600, 125, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr(w: 32, h: 40))
    @add(500, 225, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr(w: 32, h: 20))
    @add(800, 275, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr(w: 42, h: 15))


generator.defineBlock class extends @Game.LevelBlock
  name: 'GameplayDemo.TunnelStart'
  delta:
    x: 1000
    y: 0
  next: ['GameplayDemo.TunnelEnd', 'GameplayDemo.Tunnel', 'GameplayDemo.TunnelTwist']
  supports: ['speed', 'cleared']

  generate: ->
    height = 2
    @add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 350, h: 15 }))
    @add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 70 }))
    @add(450, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 550, h: 25 }))
    @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: height )
    @add(380, 0, Crafty.e('2D, Canvas, Color').color('#202020').attr({ z: -1, w: @delta.x - 380, h: @level.visibleHeight }))

    @addBackground(380, @level.visibleHeight - 360, Crafty.e('2D, Canvas, Color').color('#303030').attr({ z: 2, w: 40, h: 360 }), 1.5)
    @addBackground(380, @level.visibleHeight - 180, Crafty.e('2D, Canvas, Color').color('#505050').attr({ z: -1, w: 40, h: 180 }), .5)
    @addBackground(380, @level.visibleHeight - 90, Crafty.e('2D, Canvas, Color').color('#606060').attr({ z: -2, w: 40, h: 90 }), .25)

  inScreen: ->
    only = @settings.only || []
    if only.indexOf('cleared') is -1
      c = [
        length: 2
        x: -400
        y: 50
        duration: 3000
        type: 'sine'
      ,
        length: 0.5
        x: 400
        y: 50
        duration: 3000
        type: 'sine'
        event: 'retreat'
        data:
          name: 'fooo'
      ,
        length: 0.5
        start: 0.5
        x: -300
        y: 200
        duration: 3000
        type: 'sine'
      ]

      Crafty.e('Delay').delay(
        =>
          e = Crafty.e('Enemy')
          e.bind('retreat', (data) -> console.log "Retreating! #{data.data.name}")
          @add(650, 150, e)
          e.enemy().choreography(c, -1)
      , 500, 5)

      #@add(1000 + (Math.random() * 50), 200 + (Math.random() * 75), Crafty.e('Enemy').enemy())
      #@add(1200 + (Math.random() * 50), 50 + (Math.random() * 125), Crafty.e('Enemy').enemy())
      #@add(1200 + (Math.random() * 250), 300 + (Math.random() * 50), Crafty.e('Enemy').enemy())

generator.defineBlock class extends @Game.LevelBlock
  name: 'GameplayDemo.TunnelEnd'
  delta:
    x: 1000
    y: 0
  next: ['GameplayDemo.Asteroids', 'GameplayDemo.TunnelStart']
  supports: ['speed', 'cleared']

  generate: ->
    height = 2
    @add(0, 0, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: height )

    h = 15
    @add(0, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 350, h: h }))
    h = 70
    @add(350, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: h }))
    h = 25
    @add(450, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 550, h: h }))

    @add(0, 0, Crafty.e('2D, Canvas, Color').color('#202020').attr({ z: -1, w: 380, h: @level.visibleHeight }))

    @addBackground(380, @level.visibleHeight - 360, Crafty.e('2D, Canvas, Color').color('#303030').attr({ z: 2, w: 40, h: 360 }), 1.5)
    @addBackground(380, @level.visibleHeight - 180, Crafty.e('2D, Canvas, Color').color('#505050').attr({ z: -1, w: 40, h: 180 }), .5)
    @addBackground(380, @level.visibleHeight - 90, Crafty.e('2D, Canvas, Color').color('#606060').attr({ z: -2, w: 40, h: 90 }), .25)

  enter: ->
    only = @settings.only || []
    if only.indexOf('cleared') is -1
      c = [
        length: 2
        x: -400
        y: 50
        duration: 3000
        type: 'sine'
      ,
        length: 0.5
        x: 400
        y: 50
        duration: 3000
        type: 'sine'
      ,
        length: 0.5
        start: 0.5
        x: -300
        y: 200
        duration: 3000
        type: 'sine'
      ]

      Crafty.e('Delay').delay(
        =>
          e = Crafty.e('Enemy')
          @add(650, 150, e)
          e.enemy().choreography(c, -1)
      , 500, 5)
      #@add(650, 150, Crafty.e('Enemy').enemy())
      #@add(1000 + (Math.random() * 50), 200 + (Math.random() * 75), Crafty.e('Enemy').enemy())
      #@add(1200 + (Math.random() * 50), 50 + (Math.random() * 125), Crafty.e('Enemy').enemy())
      #@add(1200 + (Math.random() * 250), 300 + (Math.random() * 50), Crafty.e('Enemy').enemy())


generator.defineBlock class extends @Game.LevelBlock
  name: 'GameplayDemo.Tunnel'
  delta:
    x: 1000
    y: 0
  next: ['GameplayDemo.TunnelEnd', 'GameplayDemo.Tunnel', 'GameplayDemo.TunnelTwist']
  supports: ['speed', 'cleared']

  generate: ->
    @add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 350, h: 15 }))
    @add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 70 }))
    @add(450, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 550, h: 25 }))

    h = 15
    @add(0, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 350, h: h }))

    h = 70
    @add(350, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: h }))

    h = 25
    @add(450, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 550, h: h }))

    @add(0, 0, Crafty.e('2D, Canvas, Color').color('#202020').attr({ z: -1, w: @delta.x, h: @level.visibleHeight }))

  enter: ->
    only = @settings.only || []
    if only.indexOf('cleared') is -1
      c = [
        length: 2
        x: -400
        y: 50
        duration: 3000
        type: 'sine'
      ,
        length: 0.5
        x: 400
        y: 50
        duration: 3000
        type: 'sine'
      ,
        length: 0.5
        start: 0.5
        x: -300
        y: 200
        duration: 3000
        type: 'sine'
      ]

      Crafty.e('Delay').delay(
        =>
          e = Crafty.e('Enemy')
          @add(650, 150, e)
          e.enemy().choreography(c, -1)
      , 500, 5)
      #@add(1000 + (Math.random() * 50), 200 + (Math.random() * 75), Crafty.e('Enemy').enemy())
      #@add(1200 + (Math.random() * 50), 150 + (Math.random() * 125), Crafty.e('Enemy').enemy())
      #@add(1200 + (Math.random() * 250), 100 + (Math.random() * 50), Crafty.e('Enemy').enemy())

generator.defineBlock class extends @Game.LevelBlock
  name: 'GameplayDemo.Lasers'
  delta:
    x: 1000
    y: 0
  next: ['GameplayDemo.Lasers2', 'GameplayDemo.TunnelTwist']

  generate: ->
    h = 15
    @add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: @delta.x, h: h }))
    @add(0, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: @delta.x, h: h }))

    h = 100
    @add(300, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 10, h: h }))
    @add(250, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 50, h: 10 }))

    @add(400, 15 + h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 110, h: 10 }))

    h = 100
    h2 = 200
    @add(650, 15, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 10, h: h }))
    @add(600, 15 + h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 60, h: 10 }))
    @add(600, 25 + h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 10, h: h2 }))
    @add(600, 25 + h + h2, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 60, h: 10 }))
    @add(650, 25 + h2, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 60, h: 10 }))

    @add(900, 100, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 10, h: @level.visibleHeight - 100 }))

    # background
    @add(0, 0, Crafty.e('2D, Canvas, Color').color('#202020').attr({ z: -1, w: @delta.x, h: @level.visibleHeight }))

  enter: ->
    t = Crafty.e('LaserTurret')
    @add(150, 15, t)
    t.color('#808020').laserTurret(
      orientation: 'down'
      range: 160
      duration: 4000
      pauseOnEdges: 500
    )

    t = Crafty.e('LaserTurret')
    @add(570, @level.visibleHeight - 15, t)
    t.color('#808020').laserTurret(
      orientation: 'up'
      range: -200
      duration: 2000
      pauseOnEdges: 300
    )

    t = Crafty.e('LaserTurret')
    @add(830, @level.visibleHeight - 15, t)
    t.color('#808020').laserTurret(
      orientation: 'up'
      range: -200
      duration: 2000
      pauseOnEdges: 300
    )

generator.defineBlock class extends @Game.LevelBlock
  name: 'GameplayDemo.Lasers2'
  delta:
    x: 800
    y: 0
  next: ['GameplayDemo.TunnelEnd', 'GameplayDemo.Tunnel', 'GameplayDemo.TunnelTwist']
  supports: ['speed', 'cleared']

  generate: ->
    h = 15
    @add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: @delta.x, h: h }))
    @add(0, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: @delta.x, h: h }))

    h = 250
    @add(300, h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 10 }))
    @add(400, h, Crafty.e('2D, Canvas, Edge, Color, Glass').color('#404040').attr({ w: 100, h: 10, alpha: 0.5, z: 1 }))
    @add(500, h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 10 }))

    # background
    @add(0, 0, Crafty.e('2D, Canvas, Color').color('#202020').attr({ z: -1, w: @delta.x, h: @level.visibleHeight }))

  enter: ->
    t = Crafty.e('LaserTurret')
    @add(200, 15, t)
    t.color('#808020').laserTurret(
      orientation: 'down'
      range: 350
      duration: 5200
      pauseOnEdges: 500
    )

    t = Crafty.e('LaserTurret')
    @add(300, @level.visibleHeight - 15, t)
    t.color('#808020').laserTurret(
      orientation: 'up'
      range: 350
      duration: 5200
      pauseOnEdges: 500
    )

generator.defineBlock class extends @Game.LevelBlock
  name: 'GameplayDemo.TunnelTwist'
  delta:
    x: 1000
    y: 0
  next: ['GameplayDemo.TunnelTwist', 'GameplayDemo.Tunnel']
  supports: ['cleared']
  generate: ->
    @add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 250, h: 15 }))
    @add(250, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 220 }))
    @add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 650, h: 25 }))

    h = 15
    @add(0, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 650, h: h }))

    h = 220
    @add(650, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: h }))

    h = 25
    @add(750, @level.visibleHeight - h, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 250, h: h }))

    @add(0, 0, Crafty.e('2D, Canvas, Color').color('#202020').attr({ z: -1, w: @delta.x, h: @level.visibleHeight }))

generator.defineBlock class extends @Game.LevelBlock
  name: 'GameplayDemo.PerspectiveTest'
  delta:
    x: 640
    y: 0
  next: []

  generate: ->
    @add(0, 0, Crafty.e('2D, Canvas, Color').attr(w: @delta.x, h: @level.visibleHeight, alpha: 0.2, z: -1).color('#FF0000'))
    @add(0, 0, Crafty.e('2D, Canvas, Color').attr(w: 5, h: @level.visibleHeight, z: -1).color('#FF0000'))

    @addBackground(0, @level.visibleHeight * .25, Crafty.e('2D, Canvas, Color').attr(w: @delta.x * .5, h: @level.visibleHeight * .5, alpha: 0.2, z: -2).color('#00FF00'), .5)
    @addBackground(0, @level.visibleHeight * .25, Crafty.e('2D, Canvas, Color').attr(w: 5, h: @level.visibleHeight * .5, z: -2).color('#00FF00'), .5)

    @addBackground(0, @level.visibleHeight * .375, Crafty.e('2D, Canvas, Color').attr(w: @delta.x * .25, h: @level.visibleHeight * .25, alpha: 0.7, z: -3).color('#0000FF'), .25)
    @addBackground(0, @level.visibleHeight * .375, Crafty.e('2D, Canvas, Color').attr(w: 5, h: @level.visibleHeight * .25, z: -3).color('#0000FF'), .25)

generator.defineBlock class extends @Game.LevelBlock
  name: 'GameplayDemo.OceanRiser'
  delta:
    x: 1000
    y: 0
  next: ['GameplayDemo.OceanHight']

  generate: ->
    @yMotion = -180

    height = 2
    @add(0, @yMotion, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: height )
    @add(0, @yMotion, Crafty.e('2D, Canvas, Edge').attr w: 2, h: Math.abs @yMotion)

    height = 25
    @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Edge, Color').attr(w: @delta.x, h: height).color('#000080'))
    @addBackground(0, @level.visibleHeight - 65, Crafty.e('2D, Canvas, Color').color('#3030B0').attr({ z: -2, w: @delta.x * .5, h: 65 }), .5)
    @addBackground(0, @level.visibleHeight - 85, Crafty.e('2D, Canvas, Color').color('#6060E0').attr({ z: -3, w: @delta.x * .25, h: 85 }), .25)
    @addBackground(200, 45, Crafty.e('2D, Canvas, Color').color('#FFFFFF').attr({ z: -2, w: 200, h: 55 }), .5)
    @addBackground(200, 65, Crafty.e('2D, Canvas, Color').color('#DDDDDD').attr({ z: -3, w: 150, h: 55 }), .25)

  enter: ->
    console.log @name

  inScreen: ->
    if @level._forcedSpeed?.x?
      @_speedX = @level._forcedSpeed?.x
    else
      @_speedX = @level._forcedSpeed

    yFactor = @yMotion / (@delta.x - 640)
    @level.setForcedSpeed(x: @_speedX, y: @_speedX * yFactor)

  outScreen: ->
    @level.setForcedSpeed(@_speedX)

generator.defineBlock class extends @Game.LevelBlock
  name: 'GameplayDemo.OceanHigh'
  delta:
    x: 1000
    y: 0
  next: ['GameplayDemo.OceanHight', 'GameplayDemo.OceanLower']

  generate: ->
    height = 2
    @add(0, -800, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: height )

    height = 25
    @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Edge, Color').attr(w: @delta.x, h: height).color('#000080'))
    @addBackground(0, @level.visibleHeight - 65, Crafty.e('2D, Canvas, Color').color('#3030B0').attr({ z: -2, w: @delta.x * .5, h: 65 }), .5)
    @addBackground(0, @level.visibleHeight - 85, Crafty.e('2D, Canvas, Color').color('#6060E0').attr({ z: -3, w: @delta.x * .25, h: 85 }), .25)
    @addBackground(200, 45, Crafty.e('2D, Canvas, Color').color('#FFFFFF').attr({ z: -2, w: 200, h: 55 }), .5)
    @addBackground(200, 65, Crafty.e('2D, Canvas, Color').color('#DDDDDD').attr({ z: -3, w: 150, h: 55 }), .25)

  enter: ->
    super
    console.log @name

generator.defineBlock class extends @Game.LevelBlock
  name: 'GameplayDemo.OceanLower'
  delta:
    x: 1000
    y: 0
  next: ['GameplayDemo.Ocean', 'GameplayDemo.TunnelStart']

  generate: ->
    @yMotion = 180
    height = 2
    @add(0, -@yMotion, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: height )
    @add(@delta.x - 2, -@yMotion, Crafty.e('2D, Canvas, Edge').attr w: 2, h: Math.abs @yMotion)

    height = 25
    @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Edge, Color').attr(w: @delta.x, h: height).color('#000080'))
    @addBackground(0, @level.visibleHeight - 65, Crafty.e('2D, Canvas, Color').color('#3030B0').attr({ z: -2, w: @delta.x * .5, h: 65 }), .5)
    @addBackground(0, @level.visibleHeight - 85, Crafty.e('2D, Canvas, Color').color('#6060E0').attr({ z: -3, w: @delta.x * .25, h: 85 }), .25)
    @addBackground(200, 45, Crafty.e('2D, Canvas, Color').color('#FFFFFF').attr({ z: -2, w: 200, h: 55 }), .5)
    @addBackground(200, 65, Crafty.e('2D, Canvas, Color').color('#DDDDDD').attr({ z: -3, w: 150, h: 55 }), .25)

  enter: ->
    super
    console.log @name

  inScreen: ->
    if @level._forcedSpeed?.x?
      @_speedX = @level._forcedSpeed?.x
    else
      @_speedX = @level._forcedSpeed
    yFactor = @yMotion / (@delta.x - 640)
    @level.setForcedSpeed(x: @_speedX, y: @_speedX * yFactor)

  outScreen: ->
    @level.setForcedSpeed(@_speedX)

generator.defineBlock class extends @Game.LevelBlock
  name: 'GameplayDemo.Ocean'
  delta:
    x: 1000
    y: 0
  next: ['GameplayDemo.Ocean', 'GameplayDemo.TunnelStart']

  generate: ->
    height = 2
    @add(0, 0, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: height )

    height = 25
    @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Edge, Color').attr(w: @delta.x, h: height).color('#000080'))
    @addBackground(0, @level.visibleHeight - 65, Crafty.e('2D, Canvas, Color').color('#3030B0').attr({ z: -2, w: @delta.x * .5, h: 65 }), .5)
    @addBackground(0, @level.visibleHeight - 85, Crafty.e('2D, Canvas, Color').color('#6060E0').attr({ z: -3, w: @delta.x * .25, h: 85 }), .25)
    @addBackground(200, 45, Crafty.e('2D, Canvas, Color').color('#FFFFFF').attr({ z: -2, w: 200, h: 55 }), .5)
    @addBackground(200, 65, Crafty.e('2D, Canvas, Color').color('#DDDDDD').attr({ z: -3, w: 150, h: 55 }), .25)

  enter: ->
    super
    console.log @name

