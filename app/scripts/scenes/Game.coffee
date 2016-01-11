Crafty.defineScene 'Game', (data = {}) ->
  # constructor
  #
  # import from globals
  Game = window.Game

  scriptName = data?.script ? 'Test'
  script = Game.Scripts[scriptName]
  level = Game.levelGenerator.createLevel script::metadata
  level.start()

  options =
    startAtCheckpoint: data.checkpoint ? 0

  if data.checkpoint
    label = "Checkpoint #{data.checkpoint}"
    window.ga('send', 'event', 'Game', 'CheckpointStart', label)
  else
    window.ga('send', 'event', 'Game', 'Start', label)
    label = 'Begin'

  stage = new script(level)
  stage.run(options)
    .then =>
      console.log 'end of script!'
    .catch -> 'Players died'


  Crafty.bind 'GameOver', ->
    window.ga('send', 'event', 'Game', 'End', "Checkpoint #{stage.currentCheckpoint}")

    Crafty.enterScene('GameOver',
      checkpoint: stage.currentCheckpoint
      script: scriptName
    )

  Crafty.bind 'GamePause', (state) ->
    if state
      Crafty.e('2D, DOM, Text, PauseText')
        .attr(
          x: - Crafty.viewport.x,
          y: (Crafty.viewport.height * .5) - Crafty.viewport.y,
          w: Crafty.viewport.width
        )
        .text('Game Paused')
        .textColor('#D0D0D0')
        .css("textAlign", "center")
        .textFont(
          size: '15px'
          weight: 'bold'
          family: 'Press Start 2P'
        )
    else
      Crafty('PauseText').each -> @destroy()

, ->
  # destructor
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
  Crafty.unbind('GameOver')
  Crafty.unbind('GamePause')
