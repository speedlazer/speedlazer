Crafty.c 'StageEnd',
  init: ->
    @requires '2D, DOM, Text, HUD, Delay'

  stageEnd: (level) ->
    @lineNr = 0
    this.attr w: 640, z: 1
      .css 'textAlign', 'center'
      .text "Stage #{level.data.stage} Cleared: #{level.data.title}"
      .positionHud(
        x: @x,
        y: 60,
        z: -1
      )
      .textColor('#FFFFFF')
      .textFont({
        size: '16px',
        weight: 'bold',
        family: 'Courier new'
      }).delay( ->
        @showPlayerHeaders()
        @showAccuracy level, ->
          level.data.stageFinished = yes
      , 1000, 0)

  showPlayerHeaders: ->
    players = []
    Crafty('Player').each ->
      players.push @name
    @addCelledLine [''].concat players

  showAccuracy: (level, callback) ->
    accuracy = []
    Crafty('Player').each ->
      accuracy.push "#{Math.round(Math.random() * 1000) / 10.0}%"
    @addCelledLine ['Accuracy'].concat accuracy
    @delay(callback, 1000, 0)


  addCelledLine: (cells) ->
    @lineNr += 1

    y = 80 + (@lineNr * 20)

    x = 70
    cellWidth = 500.0 / cells.length
    for cell, i in cells
      c = Crafty.e('Text, DOM').attr(
        x: @x + x + (cellWidth * i)
        y: y
        w: cellWidth
        z: 3
      ).css 'textAlign', 'right'
        .text cell
        .textColor('#FFFFFF')
        .textFont({
          size: '16px',
          weight: 'bold',
          family: 'Courier new'
        })
      @attach c
      c2 = Crafty.e('Text, DOM').attr(
        x: @x + x + (cellWidth * i) + 2
        y: y + 2
        w: cellWidth
        z: 2
      ).css 'textAlign', 'right'
        .text cell
        .textColor('#000000')
        .textFont({
          size: '16px',
          weight: 'bold',
          family: 'Courier new'
        })
      @attach c2


