Crafty.defineScene 'City', (data) ->

  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#8080FF')

  level = Game.levelGenerator.createLevel
    stage: data.stage
    title: 'City'
  level.addBlock('Generic.Start')
  level.addBlock('City.Ocean')
  level.generateBlocks amount: 10
  level.addBlock('GameplayDemo.End')
  level.start()

  Crafty.bind 'EndOfLevel', ->
    level.stop()
    Crafty.enterScene('GameplayDemo', { stage: data.stage + 1 })

  Crafty.bind 'PlayerDied', ->
    playersActive = no
    Crafty('Player ControlScheme').each ->
      playersActive = yes if @lives > 0

    unless playersActive
      level.stop()
      Crafty.enterScene('GameOver')

, ->
  # destructor
  Crafty.unbind('PlayerDied')
  Crafty.unbind('EndOfLevel')
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
