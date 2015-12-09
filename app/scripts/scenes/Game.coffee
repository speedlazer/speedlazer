Crafty.defineScene 'Game', (data = {}) ->
  # constructor
  #
  # import from globals
  Game = window.Game

  scriptName = data?.script ? 'Stage1'
  #script = Game.Scripts.Stage1
  #script = Game.Scripts.Lunch
  script = Game.Scripts[scriptName]
  level = Game.levelGenerator.createLevel script::metadata
  level.start()

  options =
    startAtCheckpoint: data.checkpoint ? 0

  stage = new script(level)
  stage.run(options).then =>
    console.log 'end of script!'

  Crafty.bind 'GameOver', ->
    Crafty.enterScene('GameOver',
      checkpoint: stage.currentCheckpoint
      script: scriptName
    )

, ->
  # destructor
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
  Crafty.unbind('GameOver')
