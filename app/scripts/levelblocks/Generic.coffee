
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
    text = "Stage #{@level.data.stage}: #{@level.data.title}"
    Crafty.e('StageTitle').stageTitle(text)

