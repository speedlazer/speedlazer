
# Import
generator = @Game.levelGenerator

generator.defineBlock class extends @Game.LevelBlock
  name: 'Generic.Start'
  delta:
    x: 0
    y: 0
  next: []

  generate: ->

  enter: ->
    super
    x = 0
    text = "Stage #{@level.data.stage}: #{@level.data.title}"
    title = Crafty.e('2D, DOM, Text, Tween, Delay, HUD')
      .attr w: 640, z: 1
      .css 'textAlign', 'center'
      .text text
      .positionHud(
        x: x + @x,
        y: 240,
        z: -1
      )
    title.textColor('#FF0000')
      .textFont({
        size: '30px',
        weight: 'bold',
        family: 'Courier new'
      }).delay( ->
        @tween({ viewportY: title.viewportY + 500, alpha: 0 }, 3000)
        @bind 'TweenEnd', =>
          @destroy()
      , 3000, 0)

generator.defineBlock class extends @Game.LevelBlock
  name: 'Generic.Dialog'
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
      [conditions, speaker, lines...] = dialog.split(':')
      lines = lines.join(':').split('\n')

      x = 60

      Crafty.e('2D, DOM, Color, Tween, HUD, Dialog')
        .attr(w: 570, h: ((lines.length + 3) * 20), alpha: 0.5)
        .color('#000000')
        .positionHud(
          x: x - 10
          y: @level.visibleHeight - ((lines.length + 3) * 20)
          z: 2
        )

      Crafty.e('2D, DOM, Text, Tween, HUD, Dialog')
        .attr( w: 550)
        .text(speaker)
        .positionHud(
          x: x
          y: @level.visibleHeight - ((lines.length + 2) * 20)
          z: 2
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
            z: 2
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

    for dialog, i in @settings.dialog when i >= start
      canShow = yes
      [conditions, ...] = dialog.split(':')

      for condition in conditions.split(',')
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


generator.defineBlock class extends @Game.LevelBlock
  name: 'Generic.Event'
  delta:
    x: 0
    y: 0
  next: []
