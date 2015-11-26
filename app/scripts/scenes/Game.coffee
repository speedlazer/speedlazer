Crafty.defineScene 'Game', (data = {}) ->
  # constructor
  #
  # import from globals
  Game = window.Game

  #script = Game.Scripts.Stage1
  script = Game.Scripts.Lunch
  level = Game.levelGenerator.createLevel script::metadata
  level.start()

  options =
    startAtCheckpoint: data.checkpoint ? 0

  stage = new script(level)
  stage.run(options).then =>
    console.log 'end of script!'

  Crafty.bind 'GameOver', ->
    #console.log 'Players were at checkpoint', stage.currentCheckpoint
    Crafty.enterScene('GameOver', checkpoint: stage.currentCheckpoint)

, ->
  # destructor
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
  Crafty.unbind('GameOver')
