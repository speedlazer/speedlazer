Crafty.defineScene 'GameplayDemo', (data) ->
  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#000')
  Crafty.viewport.x = 0
  Crafty.viewport.y = 0

  level = Game.levelGenerator.createLevel(stage: data.stage)
  level.addBlock('GameplayDemo.Start')
  level.addBlock('GameplayDemo.Dialog', {
    dialog: [
      {
        has: ['Player 1'],
        name: 'John',
        lines: [
          'Welcome to the gameplay demo!'
          'Let\'s do some target practice!'
        ]
      },
      {
        has: ['Player 1', 'Player 2'],
        name: 'Jim',
        lines: [
          'Yeah let\'s shoot stuff!'
        ]
      },
      {
        only: ['Player 2'],
        name: 'Jim',
        lines: [
          'Woohoo target practice!'
          'Kill kill kill!!!'
        ]
      }
    ]
  })
  level.addBlock('GameplayDemo.Asteroids')
  level.addBlock('GameplayDemo.Dialog', {
    dialog: [
      {
        only: ['Player 1'],
        name: 'John',
        lines: [
          'Entering the tunnel!'
        ]
      },
      {
        has: ['Player 2'],
        name: 'Jim',
        lines: [
          'Prepare for darkness!!!'
        ]
      }
    ]
  })
  level.addBlock('GameplayDemo.TunnelStart')
  #level.generateBlocks(amount: 1) #, { only: ['cleared'] })
  #level.generateBlocks(stopBefore: 'GameplayDemo.Tunnel')
  level.addBlock 'GameplayDemo.Event', leave: ->
    @level.setForcedSpeed(0)
  level.addBlock('GameplayDemo.Dialog', {
    dialog: [
      {
        has: ['Player 1'],
        name: 'John',
        lines: [
          'Slow down! Lasers!!'
        ]
      }
    ]
  })
  # TODO: Add section with lasers!
  level.addBlock('GameplayDemo.Tunnel')
  #level.generateBlocks(amount: 2)
  level.addBlock('GameplayDemo.Dialog', {
    dialog: [
      {
        has: ['Player 1'],
        name: 'John',
        lines: [
          'Let\'s get out of here!'
        ]
      }
    ]
  })
  level.addBlock 'GameplayDemo.Event', inScreen: ->
    @level.setForcedSpeed(4)
  level.addBlock('GameplayDemo.TunnelTwist')
  level.generateBlocks(amount: 2, only: ['cleared'])
  level.generateBlocks(stopBefore: 'GameplayDemo.Asteroids')

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
  Crafty.unbind('EnterFrame')
  Crafty.unbind('PlayerDied')
  Crafty.unbind('EndOfLevel')
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
