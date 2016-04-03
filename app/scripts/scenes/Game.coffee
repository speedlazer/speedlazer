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

  # Load default sprites
  # This is a dirty fix to prevent
  # 'glDrawElements: attempt to render with no buffer attached to enabled attribute 6'
  # to happen mid-stage
  wait = Game.levelGenerator.loadAssets(['shadow', 'explosion']).then =>
    d = WhenJS.defer()
    e = Crafty.e('WebGL, shadow')
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
  startScript = data?.script ? 'Stage1'
  startScript = 'Test'

  if data.checkpoint
    label = "Checkpoint #{data.checkpoint}"
    window.ga('send', 'event', 'Game', 'CheckpointStart', label)
  else
    label = 'Begin'
    window.ga('send', 'event', 'Game', 'Start', label)

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
        throw e unless e.message is 'sequence mismatch'

  Crafty.bind 'ScriptFinished', (script) ->
    checkpoint = Math.max(0, script.startAtCheckpoint - script.currentCheckpoint)
    if script.nextScript
      executeScript(script.nextScript, startAtCheckpoint: checkpoint)
    else
      console.log 'End of content!'

  wait.then -> executeScript(startScript, options)

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
