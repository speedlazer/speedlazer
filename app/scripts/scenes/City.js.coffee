Crafty.defineScene 'City', (data) ->

  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#8080FF')

  level = Game.levelGenerator.createLevel
    stage: data.stage
    title: 'City'
  level.addBlock('Generic.Start')

  level.addBlock('Generic.Dialog', {
    dialog: [
      has: ['Player 1'],
      name: 'John',
      lines: [
        'Welcome to the gameplay demo!'
        'Let\'s do some target practice!'
      ]
    ,
      has: ['Player 1', 'Player 2'],
      name: 'Jim',
      lines: [
        'Yeah let\'s shoot stuff!'
      ]
    ,
      only: ['Player 2'],
      name: 'Jim',
      lines: [
        'Woohoo target practice!'
        'Kill kill kill!!!'
      ]
    ]
  })
  level.addBlock('GameplayDemo.Asteroids')
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
