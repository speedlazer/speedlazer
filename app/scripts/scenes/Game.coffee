level = null
Crafty.defineScene 'Game', (data = {}) ->
  # constructor
  #
  # import from globals
  Game = window.Game
  Game.backgroundColor = null

  scriptName = data?.script ? 'Test'
  script = Game.Scripts[scriptName]
  level = Game.levelGenerator.createLevel script::metadata
  level.start()

  options =
    startAtCheckpoint: data.checkpoint ? 0

  if data.checkpoint
    label = "Checkpoint #{data.checkpoint}"
    window.ga('send', 'event', 'Game', 'CheckpointStart', label)
  else
    window.ga('send', 'event', 'Game', 'Start', label)
    label = 'Begin'

  stage = new script(level)
  stage.run(options)
    .then =>
      console.log 'end of script!'
    .catch (e) ->
      console.error e unless e.message is 'sequence mismatch'


  Crafty.bind 'GameOver', ->
    window.ga('send', 'event', 'Game', 'End', "Checkpoint #{stage.currentCheckpoint}")
    stage.end()

    Crafty.enterScene('GameOver',
      checkpoint: stage.currentCheckpoint
      script: scriptName
    )

  Crafty.bind 'GamePause', (state) ->
    if state
      menu = Crafty.e('2D, DOM, Color, PauseMenu')
        .attr(
          x: - Crafty.viewport.x + (.35 * Crafty.viewport.width),
          y: (Crafty.viewport.height * .3) - Crafty.viewport.y,
          w: (.3 * Crafty.viewport.width)
          h: (.3 * Crafty.viewport.height)
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

      options = ['Resume', 'Restart', 'Quit']
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
        Game.togglePause()
        setTimeout ->
          if selected is 1
            Game.resetCredits()
            Crafty('Player').each -> @softReset()
            stage.end()
            Crafty.enterScene Game.firstLevel

          if selected is 2
            Crafty('Player').each -> @reset()
            stage.end()
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
  Crafty.unbind('GamePause')
