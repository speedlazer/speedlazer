
Game = @Game

class Game.EventHandler
  constructor: ->
    @eventHandling = {}

  on: (event, callback) ->
    q = @eventHandling[event] ?= []
    q.push callback
    this

  handle: (event, args...) ->
    e(args...) for e in @eventHandling[event] ? []

class Game.Dialog extends Game.EventHandler

  constructor: (@dialog, @level) ->
    super
    @showDialog()

  showDialog: (start = 0) ->
    Crafty('Dialog').each -> @destroy()
    dialogIndex = @determineDialog(start)

    unless dialogIndex?
      @handle('Finished')
      return

    dialog = @dialog[dialogIndex]
    [conditions, speaker, lines...] = dialog.split(':')
    lines = lines.join(':').split('\n')

    x = 60

    back = Crafty.e('2D, Canvas, Color, Tween, HUD, Dialog')
      .attr(w: 570, h: ((lines.length + 2) * 20), alpha: 0.5)
      .color('#000000')
      .positionHud(
        x: x - 10
        y: @level.visibleHeight - ((lines.length + 1) * 20)
        z: 100
      )

    speakerText = Crafty.e('2D, Canvas, Text')
      .attr(w: 550, x: back.x + 10, y: back.y + 10, z: 101, alpha: 1)
      .text(speaker)
      .textColor('#707070')
      .textFont({
        size: '16px',
        weight: 'bold',
        family: 'Bank Gothic'
      })
    back.attach(speakerText)

    for line, i in lines
      back.attach(Crafty.e('2D, Canvas, Text')
        .attr(
          w: 550,
          x: back.x + 10,
          y: back.y + 30 + (i * 20)
          z: 101
        )
        .text(line)
        .textColor('#909090')
        .textFont({
          size: '16px',
          weight: 'bold',
          family: 'Bank Gothic'
        })
      )

    Crafty.e('Dialog, Delay').delay( =>
        @showDialog(start + 1)
      , 2500 * lines.length, 0)


  determineDialog: (start = 0) ->
    elements = []
    Crafty('Player ControlScheme').each ->
      elements.push(@name) if @lives > 0

    for dialog, i in @dialog when i >= start
      canShow = yes
      [conditions, ...] = dialog.split(':')

      for condition in conditions.split(',')
        continue if condition is ''
        [inverse, value] = @convertCondition(condition)

        unless inverse
          canShow = no unless value in elements
        else
          canShow = no unless value not in elements

      continue unless canShow
      return i
    null

  convertCondition: (condition) ->
    inverse = condition.slice(0, 1) is '!'
    packedValue = condition.slice(if inverse then 1 else 0)
    value = "Player #{v[1]}" if v = /p(\d)/.exec packedValue

    [inverse, value]

