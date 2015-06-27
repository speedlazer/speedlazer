
# Import
generator = @Game.levelGenerator

generator.defineBlock class CityStart extends @Game.LevelBlock
  name: 'CityStart'
  delta:
    x: 200
    y: 0
  next: ['OpenSpace']

  generate: ->
    #console.log "Building #{@name} at #{@x}, #{@y}"
    @add(0, 0, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: 2 )
    @add(0, 700, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: 2 )

  enter: ->
    super
    title = Crafty.e('2D, DOM, Text, Tween, Delay').attr( w: 750, z: 1 ).text('Stage ' + @level.data.stage)
    x = 400
    @add(x, 340, title)
    title.textColor('#FF0000')
      .textFont({
        size: '30px',
        weight: 'bold',
        family: 'Courier new'
      }).delay( ->
        @tween({ y: title.y + 500, alpha: 0 }, 3000)
      , 3000, 0)

    @bind 'ViewportScroll', ->
      title.attr({ x: x - Crafty.viewport._x })

generator.defineBlock class LevelEnd extends @Game.LevelBlock
  name: 'LevelEnd'
  delta:
    x: 1500
    y: 0
  next: []

  generate: ->
    @add(0, 0, Crafty.e('2D, Canvas, Edge, Color').attr(w: 1500, h: 2))
    @add(0, 700, Crafty.e('2D, Canvas, Edge, Color').attr(w: 1500, h: 2))

  inScreen: ->
    Crafty('ScrollWall').each ->
      @off()
    endLevelTrigger = Crafty.e('2D, Canvas, Color, Collision')
      .attr({ w: 10, h: 700 })
      .onHit 'PlayerControlledShip', ->
        Crafty.trigger('EndOfLevel')
        @destroy()
    @add(1000, 0, endLevelTrigger)

generator.defineBlock class OpenSpace extends @Game.LevelBlock
  name: 'OpenSpace'
  delta:
    x: 1000
    y: 0
  next: ['OpenSpace', 'TopFloor']
  supports: ['speed', 'cleared']

  generate: ->
    @add(0, 0, Crafty.e('2D, Canvas, Edge, Color').attr(w: 1000, h: 2))
    @add(0, 700, Crafty.e('2D, Canvas, Edge, Color').attr(w: 1000, h: 2))
    @add(400, 150, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr(w: 42, h: 70))
    @add(900, 50, Crafty.e('2D, Canvas, Edge, Color').color('#404045').attr(w: 82, h: 70))
    @add(600, 250, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr(w: 52, h: 80))
    @add(500, 450, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr(w: 52, h: 40))
    @add(800, 550, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr(w: 82, h: 30))


generator.defineBlock class TopFloor extends @Game.LevelBlock
  name: 'TopFloor'
  delta:
    x: 1000
    y: 0
  next: ['OpenSpace', 'Tunnel']
  supports: ['speed', 'cleared']

  generate: ->
    @add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 350, h: 30 }))
    @add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 140 }))
    @add(450, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 550, h: 50 }))
    @add(0, 700, Crafty.e('2D, Canvas, Edge, Color').attr({ w: 1000, h: 2}))

  enter: ->
    only = @settings.only || []
    if only.indexOf('cleared') is -1
      @add(650, 300, Crafty.e('Enemy').enemy())
      @add(1000 + (Math.random() * 50), 400 + (Math.random() * 150), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 50), 100 + (Math.random() * 250), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 250), 600 + (Math.random() * 100), Crafty.e('Enemy').enemy())


generator.defineBlock class Tunnel extends @Game.LevelBlock
  name: 'Tunnel'
  delta:
    x: 1000
    y: 0
  next: ['TopFloor', 'Tunnel']
  supports: ['speed', 'cleared']

  generate: ->
    @add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 350, h: 30 }))
    @add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 140 }))
    @add(450, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 550, h: 50 }))
    @add(0, 670, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 350, h: 30 }))
    @add(350, 560, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 140 }))
    @add(450, 650, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 550, h: 50 }))

  enter: ->
    only = @settings.only || []
    if only.indexOf('cleared') is -1
      @add(1000 + (Math.random() * 50), 400 + (Math.random() * 150), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 50), 300 + (Math.random() * 250), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 250), 200 + (Math.random() * 100), Crafty.e('Enemy').enemy())


generator.defineBlock class TunnelTwist extends @Game.LevelBlock
  name: 'TunnelTwist'
  delta:
    x: 1000
    y: 0
  next: ['TunnelTwist', 'Tunnel']
  supports: ['cleared']
  generate: ->
    @add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 250, h: 30 }))
    @add(250, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 440 }))
    @add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 650, h: 50 }))

    @add(0, 670, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 650, h: 30 }))
    @add(650, 260, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 440 }))
    @add(750, 650, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 250, h: 50 }))

generator.defineBlock class Dialog extends @Game.LevelBlock
  name: 'Dialog'
  delta:
    x: 0
    y: 0
  next: []
  inScreen: ->
    super
    players = []
    Crafty('Player ControlScheme').each ->
      players.push(@name) if @lives > 0

    for dialog in @settings.dialog
      canShow = yes

      if dialog.has?
        for playerName in dialog.has
          canShow = no if players.indexOf(playerName) is -1

      if dialog.only?
        for playerName in players
          canShow = no if dialog.only.indexOf(playerName) is -1

      continue unless canShow

      console.log dialog.name
      console.log "  #{line}" for line in dialog.lines

