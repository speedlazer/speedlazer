
# Import
generator = @Game.levelGenerator

GameplayDemo = {}

generator.defineBlock class GameplayDemo.Start extends @Game.LevelBlock
  name: 'GameplayDemo.Start'
  delta:
    x: 200
    y: 0
  next: ['GameplayDemo.Asteroids']

  generate: ->
    height = 2
    @add(0, 0, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: height )
    @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: height )

  enter: ->
    super
    x = 250
    title = Crafty.e('2D, DOM, Text, Tween, Delay, HUD')
      .attr( w: 350, z: 1 )
      .text('Stage ' + @level.data.stage)
      .positionHud(
        x: x + @x,
        y: 240,
        z: -1
      )
    @add(x, 340, title)

    title.textColor('#FF0000')
      .textFont({
        size: '30px',
        weight: 'bold',
        family: 'Courier new'
      }).delay( ->
        @tween({ viewportY: title.viewportY + 500, alpha: 0 }, 3000)
      , 3000, 0)


generator.defineBlock class GameplayDemo.End extends @Game.LevelBlock
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


generator.defineBlock class GameplayDemo.Asteroids extends @Game.LevelBlock
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


generator.defineBlock class GameplayDemo.TunnelStart extends @Game.LevelBlock
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

  enter: ->
    only = @settings.only || []
    if only.indexOf('cleared') is -1
      @add(650, 150, Crafty.e('Enemy').enemy())
      @add(1000 + (Math.random() * 50), 200 + (Math.random() * 75), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 50), 50 + (Math.random() * 125), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 250), 300 + (Math.random() * 50), Crafty.e('Enemy').enemy())

generator.defineBlock class GameplayDemo.TunnelEnd extends @Game.LevelBlock
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
      @add(650, 150, Crafty.e('Enemy').enemy())
      @add(1000 + (Math.random() * 50), 200 + (Math.random() * 75), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 50), 50 + (Math.random() * 125), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 250), 300 + (Math.random() * 50), Crafty.e('Enemy').enemy())


generator.defineBlock class GameplayDemo.Tunnel extends @Game.LevelBlock
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
      @add(1000 + (Math.random() * 50), 200 + (Math.random() * 75), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 50), 150 + (Math.random() * 125), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 250), 100 + (Math.random() * 50), Crafty.e('Enemy').enemy())

generator.defineBlock class GameplayDemo.Lasers extends @Game.LevelBlock
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
    @add(600, 25 + h + h2, Crafty.e('2D, Canvas, Edge, Color, Glass').color('#404040').attr({ w: 60, h: 10, alpha: 0.5, z: 1 }))
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

generator.defineBlock class GameplayDemo.Lasers2 extends @Game.LevelBlock
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

generator.defineBlock class GameplayDemo.TunnelTwist extends @Game.LevelBlock
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

generator.defineBlock class GameplayDemo.Dialog extends @Game.LevelBlock
  name: 'GameplayDemo.Dialog'
  delta:
    x: 0
    y: 0
  next: []
  inScreen: ->
    super
    @showDialog() if !@settings.triggerOn? or @settings.triggerOn is 'inScreen'

  enter: ->
    super
    @showDialog() if @settings.triggerOn is 'enter'

  leave: ->
    super
    @showDialog() if @settings.triggerOn is 'leave'

  showDialog: (start = 0) ->
    Crafty('Dialog').each -> @destroy()
    dialogIndex = @determineDialog(start)
    if dialogIndex?
      dialog = @settings.dialog[dialogIndex]
      x = 60

      Crafty.e('2D, DOM, Text, Tween, HUD, Dialog')
        .attr( w: 550)
        .text(dialog.name)
        .positionHud(
          x: x
          y: @level.visibleHeight - ((dialog.lines.length + 2) * 20)
          z: 2
        )
        .textColor('#909090')
        .textFont({
          size: '16px',
          weight: 'bold',
          family: 'Courier new'
        })

      for line, i in dialog.lines
        Crafty.e('2D, DOM, Text, Tween, HUD, Dialog')
          .attr( w: 550)
          .text(line)
          .positionHud(
            x: x
            y: @level.visibleHeight - ((dialog.lines.length + 1 - i) * 20)
            z: 2
          )
          .textColor('#909090')
          .textFont({
            size: '16px',
            weight: 'bold',
            family: 'Courier new'
          })


      console.log dialog.name
      console.log "  #{line}" for line in dialog.lines

      Crafty.e('Dialog, Delay').delay( =>
          @showDialog(start + 1)
        , 2500 * dialog.lines.length, 0)


  determineDialog: (start = 0) ->
    players = []
    Crafty('Player ControlScheme').each ->
      players.push(@name) if @lives > 0

    for dialog, i in @settings.dialog when i >= start
      canShow = yes

      if dialog.has?
        for playerName in dialog.has
          canShow = no if players.indexOf(playerName) is -1

      if dialog.only?
        for playerName in players
          canShow = no if dialog.only.indexOf(playerName) is -1

      continue unless canShow
      return i
    null

generator.defineBlock class GameplayDemo.Event extends @Game.LevelBlock
  name: 'GameplayDemo.Event'
  delta:
    x: 0
    y: 0
  next: []

  inScreen: ->
    super
    @settings.inScreen?.apply this

  enter: ->
    super
    @settings.enter?.apply this

  leave: ->
    super
    @settings.leave?.apply this

