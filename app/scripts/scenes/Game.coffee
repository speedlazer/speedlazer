level = null
Crafty.defineScene 'Game', (data = {}) ->
  # constructor
  #
  # import from globals
  Game = window.Game
  Game.backgroundColor = null

  level = Game.levelGenerator.createLevel()
  level.start()

  options =
    startAtCheckpoint: data.checkpoint ? 0

  if data.checkpoint
    label = "Checkpoint #{data.checkpoint}"
    window.ga('send', 'event', 'Game', 'CheckpointStart', label)
  else
    window.ga('send', 'event', 'Game', 'Start', label)
    label = 'Begin'

  script = null
  scriptName = null

  executeScript = (name, options) ->
    scriptName = name
    scriptClass = Game.Scripts[name]
    unless scriptClass?
      console.error "Script #{name} is not defined"
      Crafty.trigger 'GameOver'
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
    script.end()

    Crafty.enterScene('GameOver',
      checkpoint: script.currentCheckpoint
      script: scriptName
    )

  Crafty.bind 'GamePause', (state) ->
    if state
      soundText = ->
        if Crafty.audio.muted
          'Sound [off]'
        else
          'Sound [on]'
      options = ['Resume', soundText(), 'Restart', 'Quit']

      menu = Crafty.e('2D, DOM, Color, PauseMenu')
        .attr(
          x: - Crafty.viewport.x + (.35 * Crafty.viewport.width),
          y: (Crafty.viewport.height * .3) - Crafty.viewport.y,
          w: (.3 * Crafty.viewport.width)
          h: (options.length + 2) * 32
          z: 100
          alpha: .3
        )
        .color('#000000')

      title = Crafty.e('2D, DOM, Text')
        .attr(
          x: menu.x
          y: menu.y + 20
          w: menu.w
          z: 110
        )
        .text('Game Paused')
        .textColor('#D0D0D0')
        .css("textAlign", "center")
        .textFont(
          size: '15px'
          weight: 'bold'
          family: 'Press Start 2P'
        )
      menu.attach title

      optionEntities = for o, i in options
        menuItem = Crafty.e('2D, DOM, Text')
          .attr(
            x: menu.x + 60
            y: menu.y + 50 + (35 * i)
            w: menu.w - 60
            z: 110
          )
          .text(o)
          .textColor('#D0D0D0')
          .css("textAlign", "left")
          .textFont(
            size: '15px'
            weight: 'bold'
            family: 'Press Start 2P'
          )
        menu.attach menuItem
        menuItem

      selected = 0

      selectionChar = Crafty.e('2D, DOM, Text')
        .attr(
          x: menu.x + 20
          w: 40
          z: 110
        )
        .text('>')
        .textColor('#0000FF')
        .css("textAlign", "left")
        .textFont(
          size: '15px'
          weight: 'bold'
          family: 'Press Start 2P'
        )
      menu.attach selectionChar

      updateSelection = ->
        selectionChar.attr(
          y: optionEntities[selected].y
        )

      updateSelection()
      executeSelection = ->
        setTimeout ->
          if selected is 0
            Game.togglePause()
          if selected is 1
            Crafty.audio.toggleMute()
            optionEntities[selected].text soundText()
          if selected is 2
            Game.togglePause()
            Game.resetCredits()
            Crafty('Player').each -> @softReset()
            script.end()
            Crafty.enterScene Game.firstLevel
          if selected is 3
            Game.togglePause()
            Crafty('Player').each -> @reset()
            script.end()
            Crafty.enterScene 'Intro'

      Crafty('Player').each ->
        @bind 'Up', ->
          selected = (options.length + selected - 1) % options.length
          updateSelection()
        @bind 'Down', ->
          selected = (options.length + selected + 1) % options.length
          updateSelection()
        @bind 'Fire', ->
          executeSelection()
    else
      Crafty('Player').each ->
        @unbind 'Up'
        @unbind 'Down'
        @unbind 'Fire'
      Crafty('PauseMenu').each -> @destroy()

, ->
  # destructor
  level.stop()
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
  Crafty.unbind('GameOver')
  Crafty.unbind('ScriptFinished')
  Crafty.unbind('GamePause')
