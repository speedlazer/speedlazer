
# Import
generator = @Game.levelGenerator

generator.defineBlock class CityStart extends @Game.LevelBlock
  name: 'CityStart'
  delta:
    x: 200
    y: 0
  next: ['OpenSpace']

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
        z: 2
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
    height = 2
    @add(0, 0, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: height )
    @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: height )

    @add(400, 75, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr(w: 22, h: 35))
    @add(900, 25, Crafty.e('2D, Canvas, Edge, Color').color('#404045').attr(w: 42, h: 35))
    @add(600, 125, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr(w: 32, h: 40))
    @add(500, 225, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr(w: 32, h: 20))
    @add(800, 275, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr(w: 42, h: 15))


generator.defineBlock class TopFloor extends @Game.LevelBlock
  name: 'TopFloor'
  delta:
    x: 1000
    y: 0
  next: ['OpenSpace', 'Tunnel', 'TunnelTwist']
  supports: ['speed', 'cleared']

  generate: ->
    height = 2
    @add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 350, h: 15 }))
    @add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 70 }))
    @add(450, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 550, h: 25 }))

    @add(0, @level.visibleHeight - height, Crafty.e('2D, Canvas, Edge').attr w: @delta.x, h: height )

  enter: ->
    only = @settings.only || []
    if only.indexOf('cleared') is -1
      @add(650, 150, Crafty.e('Enemy').enemy())
      @add(1000 + (Math.random() * 50), 200 + (Math.random() * 75), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 50), 50 + (Math.random() * 125), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 250), 300 + (Math.random() * 50), Crafty.e('Enemy').enemy())


generator.defineBlock class Tunnel extends @Game.LevelBlock
  name: 'Tunnel'
  delta:
    x: 1000
    y: 0
  next: ['TopFloor', 'Tunnel', 'TunnelTwist']
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

  enter: ->
    only = @settings.only || []
    if only.indexOf('cleared') is -1
      @add(1000 + (Math.random() * 50), 200 + (Math.random() * 75), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 50), 150 + (Math.random() * 125), Crafty.e('Enemy').enemy())
      @add(1200 + (Math.random() * 250), 100 + (Math.random() * 50), Crafty.e('Enemy').enemy())


generator.defineBlock class TunnelTwist extends @Game.LevelBlock
  name: 'TunnelTwist'
  delta:
    x: 1000
    y: 0
  next: ['TunnelTwist', 'Tunnel']
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

generator.defineBlock class Dialog extends @Game.LevelBlock
  name: 'Dialog'
  delta:
    x: 0
    y: 0
  next: []
  inScreen: ->
    super
    @showDialog()

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
          y: @screenHeight - ((dialog.lines.length + 2) * 20)
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
            y: @screenHeight - ((dialog.lines.length + 1 - i) * 20)
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
        , 3000, 0)


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

