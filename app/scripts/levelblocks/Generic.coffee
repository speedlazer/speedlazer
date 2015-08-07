
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
    @level.showDialog(@settings.dialog) if !@settings.triggerOn? or @settings.triggerOn is 'inScreen'

  enter: ->
    super
    @level.showDialog(@settings.dialog) if @settings.triggerOn is 'enter'

  leave: ->
    super
    @level.showDialog(@settings.dialog) if @settings.triggerOn is 'leave'


generator.defineBlock class extends @Game.LevelBlock
  name: 'Generic.Event'
  delta:
    x: 0
    y: 0
  next: []
