Crafty.defineScene 'Space', (data) ->
  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#000')
  Crafty.viewport.x = 0
  Crafty.viewport.y = 0


  Crafty.one 'ShipSpawned', ->
    Crafty.e('ScrollWall').scrollWall(1)

  Crafty.bind 'ShipSpawned', (ship) ->
    ship.forcedSpeed(1)

  Crafty('Player').each (index) ->
    @addComponent('ShipSpawnable').spawnPosition(140, 300 + (index * 50))
    Crafty.e('PlayerInfo').playerInfo(30 + (index * 300), this)

  Crafty('Player ControlScheme').each -> @spawnShip()

  level = Game.levelGenerator.createLevel(stage: data.stage)
  level.addBlock('CityStart')
  level.addBlock('Dialog', {
    dialog: [
      {
        has: ['Player 1'],
        name: 'John',
        lines: [
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
        ]
      }
    ]
  })
  level.addBlock('OpenSpace')
  level.addBlock('TopFloor')
  level.generateBlocks(10) #, { only: ['cleared'] })

  level.addBlock('LevelEnd')
  level.start()

  Crafty.bind 'EndOfLevel', ->
    level.stop()
    Crafty.enterScene('Space', { stage: data.stage + 1 })

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
  Crafty.unbind('ShipSpawned')
  Crafty.unbind('EndOfLevel')
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
