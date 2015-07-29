Crafty.defineScene 'GameplayDemo', (data) ->
  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#000')

  level = Game.levelGenerator.createLevel
    stage: data.stage
    title: 'Gameplay Demo'

  level.addBlock('Generic.Start')
  level.addBlock 'Generic.Event',
    enter: ->
      @level.setForcedSpeed(2)

  level.addBlock('GameplayDemo.PerspectiveTest')
  level.addBlock('GameplayDemo.PerspectiveTest')

  level.addBlock('GameplayDemo.TunnelStart', only: ['cleared'])
  level.generateBlocks(amount: 3, only: ['cleared'])

  #level.addBlock 'Generic.Event',
    #enter: ->
      #@level.setForcedSpeed(1)

  #level.addBlock('Generic.Dialog', {
    #dialog: [
      #has: ['Player 1'],
      #name: 'John',
      #lines: [
        #'Welcome to the gameplay demo!'
        #'Let\'s do some target practice!'
      #]
    #,
      #has: ['Player 1', 'Player 2'],
      #name: 'Jim',
      #lines: [
        #'Yeah let\'s shoot stuff!'
      #]
    #,
      #only: ['Player 2'],
      #name: 'Jim',
      #lines: [
        #'Woohoo target practice!'
        #'Kill kill kill!!!'
      #]
    #]
  #})
  #level.addBlock('GameplayDemo.Asteroids')
  #level.addBlock('Generic.Dialog', {
    #dialog: [
      #only: ['Player 1'],
      #name: 'John',
      #lines: [
        #'Entering the tunnel!'
      #]
    #,
      #has: ['Player 2'],
      #name: 'Jim',
      #lines: [
        #'Prepare for darkness!!!'
      #]
    #]
  #})
  #level.addBlock('GameplayDemo.TunnelStart')
  #level.addBlock('GameplayDemo.Tunnel')
  #level.addBlock('Generic.Dialog', {
    #triggerOn: 'enter'
    #dialog: [
      #has: ['Player 1'],
      #name: 'John',
      #lines: [
        #'Slow down! Lasers!!'
      #]
    #,
      #only: ['Player 2'],
      #name: 'Jim',
      #lines: [
        #'Uhoh! Danger!'
      #]
    #]
  #})
  #level.addBlock 'Generic.Event', enter: ->
    #@level.setForcedSpeed(0)

  #level.addBlock('GameplayDemo.Lasers')
  #level.generateBlocks(amount: 1)
  #level.addBlock('Generic.Dialog', {
    #dialog: [
      #has: ['Player 1'],
      #name: 'John',
      #lines: [
        #'Let\'s get out of here!'
      #]
    #]
  #})
  #level.addBlock 'Generic.Event', inScreen: ->
    #@level.setForcedSpeed(4)
  #level.addBlock('GameplayDemo.Tunnel', only: ['cleared'])
  #level.generateBlocks(amount: 2, only: ['cleared'])
  #level.generateBlocks(stopBefore: 'GameplayDemo.TunnelEnd')
  level.addBlock('GameplayDemo.TunnelEnd', only: ['cleared'])
  level.addBlock 'Generic.Event',
    enter: ->
      @level.setForcedSpeed(2)
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
