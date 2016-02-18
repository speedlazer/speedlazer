level = null
script = null
scriptName = null
Game = @Game

Crafty.defineScene 'Game', (data = {}) ->
  # constructor
  #
  # import from globals
  Game.backgroundColor = null
  level = Game.levelGenerator.createLevel()
  level.start()

  options =
    startAtCheckpoint: data.checkpoint ? 6

  if data.checkpoint
    label = "Checkpoint #{data.checkpoint}"
    window.ga('send', 'event', 'Game', 'CheckpointStart', label)
  else
    window.ga('send', 'event', 'Game', 'Start', label)
    label = 'Begin'

  executeScript = (name, options) ->
    scriptName = name
    scriptClass = Game.Scripts[name]
    unless scriptClass?
      console.error "Script #{name} is not defined"
      return
    script = new scriptClass(level)
    script.run(options)
      .then -> Crafty.trigger('ScriptFinished', script)
      .catch (e) ->
        console.error e unless e.message is 'sequence mismatch'

  Crafty.bind 'ScriptFinished', (script) ->
    checkpoint = Math.max(0, script.startAtCheckpoint - script.currentCheckpoint)
    executeScript(script.nextScript, startAtCheckpoint: checkpoint)

  executeScript((data?.script ? 'Stage1'), options)

  Crafty.bind 'GameOver', ->
    window.ga('send', 'event', 'Game', 'End', "Checkpoint #{script.currentCheckpoint}")

    Crafty.enterScene('GameOver',
      checkpoint: script.currentCheckpoint
      script: scriptName
    )

  new Game.PauseMenu

, ->
  # destructor
  script.end()
  level.stop()
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
  Crafty.unbind('GameOver')
  Crafty.unbind('ScriptFinished')
  Crafty.unbind('GamePause')
