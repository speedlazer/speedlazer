Game = @Game

# Crude extraction of logic. It needs more refactoring,
# and could be extracted more to a generic Menu class
class Game.PauseMenu
  constructor: ->
    Crafty.bind 'GamePause', (state) =>
      if state
        @createMenu()
        @showPlayers()
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

  showPlayers: ->
    Crafty('Player').each ->
      return unless @ship
      xOff = .05
      xOff = .70 if @playerNumber is 2

      Crafty.e('2D, WebGL, playerShip, ColorEffects, PauseMenu')
        .attr(
          w: 71
          h: 45
          x: - Crafty.viewport.x + ((xOff + .07) * Crafty.viewport.width)
          y: (Crafty.viewport.height * .3) - Crafty.viewport.y + 20
          z: 101
        )
        .colorOverride?(@color(), 'partial')
      statList = [
        "Score: #{@points}"
        "Lives: #{@lives - 1}"
        ""
        "Speed: &nbsp;&nbsp;&nbsp;&nbsp;+#{@ship.primaryWeapon.stats.speed}"
        "RapidFire: +#{@ship.primaryWeapon.stats.rapid}"
        "AimAssist: +#{@ship.primaryWeapon.stats.aim}"
        "Damage: &nbsp;&nbsp;&nbsp;+#{@ship.primaryWeapon.stats.damage}"
      ]
      stats = Crafty.e('2D, WebGL, Color, PauseMenu')
        .attr(
          x: - Crafty.viewport.x + (xOff * Crafty.viewport.width)
          y: (Crafty.viewport.height * .3) - Crafty.viewport.y
          w: (.25 * Crafty.viewport.width)
          h: (statList.length + 5) * 20
          z: 100
          alpha: .3
        )
        .color('#000')
      for o, i in statList
        stat= Crafty.e('2D, DOM, Text')
          .attr(
            x: stats.x + 20
            y: stats.y + 85 + (20 * i)
            w: stats.w - 60
            z: 110
          )
          .text(o)
          .textColor('#D0D0D0')
          .css("textAlign", "left")
          .textFont(
            size: '8px'
            weight: 'bold'
            family: 'Press Start 2P'
          )
        stats.attach stat


  remove: ->
    Crafty('Player').each ->
      @unbind 'Up'
      @unbind 'Down'
      @unbind 'Fire'
    Crafty('PauseMenu').each -> @destroy()
