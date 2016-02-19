Game = @Game

# Crude extraction of logic. It needs more refactoring,
# and could be extracted more to a generic Menu class
class Game.PauseMenu
  constructor: ->
    Crafty.bind 'GamePause', (state) =>
      if state
        @createMenu()
      else
        @remove()

  createMenu: ->
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
          Crafty.enterScene Game.firstLevel
        if selected is 3
          Game.togglePause()
          Crafty('Player').each -> @reset()
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

  remove: ->
    Crafty('Player').each ->
      @unbind 'Up'
      @unbind 'Down'
      @unbind 'Fire'
    Crafty('PauseMenu').each -> @destroy()
