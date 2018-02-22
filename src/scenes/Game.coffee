Stage1 = require('src/lazerscripts/stage1').default
Test = require('src/lazerscripts/Test').default
Benchmark = require('src/lazerscripts/benchmark').default

levelGenerator = require('src/lib/LevelGenerator').default

level = null
script = null
scriptName = null

Crafty.defineScene 'Game', (data = {}) ->
  # constructor
  #
  # import from globals
  Game.backgroundColor = null
  level = levelGenerator.createLevel()

  Crafty.createLayer('UILayerDOM', 'DOM',
    scaleResponse: 0
    yResponse: 0
    xResponse: 0
    z: 40
  )
  Crafty.createLayer('UILayerWebGL', 'WebGL',
    scaleResponse: 0
    yResponse: 0
    xResponse: 0
    z: 35
  )
  Crafty.createLayer('StaticBackground', 'WebGL',
    scaleResponse: 0
    yResponse: 0
    xResponse: 0
    z: 0
  )

  Crafty.e('BigText, LoadingText').bigText('Loading')

  # Load default sprites
  # This is a dirty fix to prevent
  # 'glDrawElements: attempt to render with no buffer attached to enabled attribute 6'
  # to happen mid-stage
  wait = levelGenerator.loadAssets(['explosion']).then =>
    d = WhenJS.defer()
    e = Crafty.e('WebGL, explosion')
    setTimeout(
      ->
        e.destroy()
        d.resolve()
      100
    )
    d.promise

  level.start()
  Crafty('Player').each -> @level = level

  options =
    startAtCheckpoint: data.checkpoint ? 0
  startScript = data?.script ? Stage1

  if data.checkpoint
    label = "Checkpoint #{data.checkpoint}"
    window.ga?('send', 'event', 'Game', 'CheckpointStart', label)
  else
    label = 'Begin'
    window.ga?('send', 'event', 'Game', 'Start', label)

  executeScript = (scriptClass, options) ->
    unless scriptClass?
      console.error 'Script is not defined'
      return
    script = new scriptClass(level)
    script.run(options)
      .then -> Crafty.trigger('ScriptFinished', script)
      .catch (e) ->
        throw e unless e.message is 'sequence mismatch'

  checkpointsPassed = 0

  Crafty.bind 'ScriptFinished', (script) ->
    checkpoint = Math.max(0, script.startAtCheckpoint - script.currentCheckpoint)
    checkpointsPassed += script.currentCheckpoint
    if script.nextScript
      executeScript(script.nextScript, startAtCheckpoint: checkpoint)
    else
      if script.gotoGameOver
        Crafty.enterScene('GameOver',
          gameCompleted: yes
        )
      console.log 'End of content!'

  wait.then ->
    executeScript(startScript, options)

  Crafty.bind 'GameOver', ->
    window.ga('send', 'event', 'Game', 'End', "Checkpoint #{script.currentCheckpoint}")

    Crafty.enterScene('GameOver',
      checkpoint: checkpointsPassed + script.currentCheckpoint
      script: startScript
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
