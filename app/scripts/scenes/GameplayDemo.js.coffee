Crafty.defineScene 'GameplayDemo', (data) ->
  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#000')

  level = Game.levelGenerator.createLevel
    stage: data.stage
    title: 'Gameplay Demo'

  level.addBlock('Generic.Start')
  level.addBlock 'Generic.Event', enter: -> @level.setForcedSpeed(2)
  level.addBlock('GameplayDemo.PerspectiveTest')
  level.addBlock('GameplayDemo.PerspectiveTest')
  level.addBlock 'Generic.Event', enter: -> @level.setForcedSpeed(1)
  level.addBlock('Generic.Dialog', {
    dialog: [
      'p1:John:Welcome to the gameplay demo!\nLet\'s do some target practice!'
      'p1,p2:Jim:Yeah let\'s shoot stuff!'
      '!p1,p2:Jim:Whoohoo target practice!\nKill kill kill!!!'
    ]
  })
  level.addBlock('GameplayDemo.Asteroids')
  level.addBlock('Generic.Dialog', {
    dialog: [
      'p1,!p2:John:Entering the tunnel!'
      'p2:Jim:Prepare for darkness!!!'
    ]
  })
  level.addBlock 'Generic.Event', inScreen: ->
    @level.data.needToKill = 10

    counter = Crafty.e('2D, DOM, Text, HUD')
      .text("Enemies Left: #{@level.data.needToKill}")
      .textColor('#FF0000')
      .css('textAlign', 'center')
      .textFont({
        size: '20px',
        weight: 'bold',
        family: 'Courier new'
      })
      .attr(w: 640)
      .positionHud(x: 0, y: 110, z: 2)
    evt = Crafty.bind 'EnemyDestroyed', =>
      @level.data.needToKill -= 1
      counter.text("Enemies Left: #{@level.data.needToKill}")
      if @level.data.needToKill <= 0
        counter.destroy()
        Crafty.unbind evt
        @level.data.needToKill = 0

  level.addBlock('GameplayDemo.TunnelStart', only: ['cleared'])
  level.generateBlocks until: -> @data.needToKill is 0
  level.generateBlocks(stopBefore: 'GameplayDemo.Tunnel')

  #level.addBlock('GameplayDemo.Tunnel')
  level.addBlock('Generic.Dialog', {
    triggerOn: 'enter'
    dialog: [
      'p1:John:Slow down! Lasers!!'
      '!p1,p2:Jim:Uh oh! Danger!'
    ]
  })
  level.addBlock 'Generic.Event', enter: ->
    @level.setForcedSpeed(0)

  level.addBlock('GameplayDemo.Lasers')
  level.generateBlocks(amount: 1)
  level.addBlock('Generic.Dialog', {
    dialog: [
      'p1:John:Let\'s get out of here!'
    ]
  })
  level.addBlock 'Generic.Event', inScreen: -> @level.setForcedSpeed(4)
  level.addBlock('GameplayDemo.TunnelTwist')
  level.generateBlocks(amount: 2, only: ['cleared'])
  level.generateBlocks(stopBefore: 'GameplayDemo.TunnelEnd')
  level.addBlock('GameplayDemo.TunnelEnd', only: ['cleared'])
  level.addBlock 'Generic.Event', enter: -> @level.setForcedSpeed(2)
  level.addBlock('GameplayDemo.Ocean')
  level.addBlock('GameplayDemo.OceanRiser')
  level.addBlock('GameplayDemo.OceanHigh')
  level.addBlock('GameplayDemo.OceanHigh')
  level.addBlock('GameplayDemo.OceanLower')
  level.addBlock('GameplayDemo.Ocean')
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
