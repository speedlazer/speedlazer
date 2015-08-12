
Game = @Game

class Game.Dialog

  constructor: (@dialog, @level) ->
    @showDialog()

  showDialog: (start = 0) ->
    Crafty('Dialog').each -> @destroy()
    dialogIndex = @determineDialog(start)

    if dialogIndex?
      dialog = @dialog[dialogIndex]
      [conditions, speaker, lines...] = dialog.split(':')
      lines = lines.join(':').split('\n')

      x = 60

      Crafty.e('2D, DOM, Color, Tween, HUD, Dialog')
        .attr(w: 570, h: ((lines.length + 3) * 20), alpha: 0.5)
        .color('#000000')
        .positionHud(
          x: x - 10
          y: @level.visibleHeight - ((lines.length + 3) * 20)
          z: 100
        )

      Crafty.e('2D, DOM, Text, Tween, HUD, Dialog')
        .attr( w: 550)
        .text(speaker)
        .positionHud(
          x: x
          y: @level.visibleHeight - ((lines.length + 2) * 20)
          z: 100
        )
        .textColor('#909090')
        .textFont({
          size: '16px',
          weight: 'bold',
          family: 'Courier new'
        })

      for line, i in lines
        Crafty.e('2D, DOM, Text, Tween, HUD, Dialog')
          .attr( w: 550)
          .text(line)
          .positionHud(
            x: x
            y: @level.visibleHeight - ((lines.length + 1 - i) * 20)
            z: 101
          )
          .textColor('#909090')
          .textFont({
            size: '16px',
            weight: 'bold',
            family: 'Courier new'
          })

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

