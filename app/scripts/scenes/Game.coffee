Crafty.defineScene 'Game', (data) ->
  # constructor
  #
  # import from globals
  Game = window.Game

  script = Game.Scripts.Stage1
  #script = Game.Scripts.BossFight
  level = Game.levelGenerator.createLevel script::metadata
  level.start()

  new script(level).run().then =>
    console.log 'end of script!'

, ->
  # destructor
  Crafty('Delay').each -> @destroy()
  Crafty.unbind('PlayerDied')
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
