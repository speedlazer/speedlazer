{ togglePause } = require('src/lib/core/pauseToggle')

# Crude extraction of logic. It needs more refactoring,
# and could be extracted more to a generic Menu class
class PauseMenu
  constructor: ->
    Crafty.bind 'GamePause', (state) =>
      if state
        @createMenu()
        @showPlayers()
      else
        @remove()

  createMenu: ->
    @_buildMenu([
      {
        text: 'Resume'
        execute: ->
          togglePause()
      }
      {
        text: ->
          if Crafty.audio.muted then 'Sound [off]' else 'Sound [on]'
        execute: ->
          Crafty.audio.toggleMute()
          Game.changeSettings(sound: !Crafty.audio.muted)
      }
      {
        text: 'Restart'
        execute: ->
          togglePause()
          Game.resetCredits()
          Crafty('Player').each -> @softReset()
          Crafty.enterScene 'Game'
      }
      {
        text: 'Quit'
        execute: ->
          togglePause()
          Crafty('Player').each -> @reset()
          Crafty.enterScene 'Intro'
      }
    ])

  _buildMenu: (@options) ->
    menu = Crafty.e('2D, UILayerDOM, Color, PauseMenu')
      .attr(
        x: (.35 * Crafty.viewport.width),
        y: (Crafty.viewport.height * .3),
        w: (.3 * Crafty.viewport.width)
        h: (@options.length + 2) * 32
        z: 100
        alpha: .5
      )
      .color('#000000')

    title = Crafty.e('2D, UILayerDOM, Text')
      .attr(
        x: menu.x
        y: menu.y + 20
        w: menu.w
        z: 110
      )
      .text('Game Paused')
      .textColor('#D0D0D0')
      .textAlign 'center'
      .textFont(
        size: '15px'
        weight: 'bold'
        family: 'Press Start 2P'
      )
    menu.attach title

    for o, i in @options
      menuItem = Crafty.e('2D, UILayerDOM, Text')
        .attr(
          x: menu.x + 60
          y: menu.y + 50 + (35 * i)
          w: menu.w - 60
          z: 110
        )
        .text(o.text?() ? o.text)
        .textColor('#D0D0D0')
        .textAlign 'left'
        .textFont(
          size: '15px'
          weight: 'bold'
          family: 'Press Start 2P'
        )
      menu.attach menuItem
      o.entity = menuItem

    @selected = 0

    @selectionChar = Crafty.e('2D, UILayerDOM, Text')
      .attr(
        x: menu.x + 20
        w: 40
        z: 110
      )
      .text('>')
      .textColor('#0000FF')
      .textAlign 'left'
      .textFont(
        size: '15px'
        weight: 'bold'
        family: 'Press Start 2P'
      )
    menu.attach @selectionChar
    @updateSelection()

    self = this
    Crafty('Player').each ->
      @bind 'Up', self._handleUp
      @bind 'Down', self._handleDown
      @bind 'Fire', self._handleFire

  _handleUp: =>
    @selected = (@options.length + @selected - 1) % @options.length
    @updateSelection()

  _handleDown: =>
    @selected = (@options.length + @selected + 1) % @options.length
    @updateSelection()

  updateSelection: ->
    @selectionChar.attr(
      y: @options[@selected].entity.y
    )

  _handleFire: =>
    setTimeout =>
      selected = @options[@selected]
      selected.execute()
      selected.entity.text(selected.text?() ? selected.text)

  showPlayers: ->
    Crafty('Player').each ->
      return unless @ship
      xOff = .05
      xOff = .70 if @playerNumber is 2

      Crafty.e('2D, WebGL, playerShip, ColorEffects, PauseMenu')
        .attr(
          w: 71
          h: 45
          x: ((xOff + .07) * Crafty.viewport.width)
          y: (Crafty.viewport.height * .3) + 20
          z: 101
        )
        .flip('X')
        .colorOverride?(@color(), 'partial')
      statList = [
        "Score: #{@points}"
        "Lives: #{@lives - 1}"
        ""
        "&nbsp;&nbsp; Speed: &nbsp;&nbsp;&nbsp;&nbsp;+#{@ship.primaryWeapon.stats.speed}"
        "&nbsp;&nbsp; RapidFire: +#{@ship.primaryWeapon.stats.rapid}"
        "&nbsp;&nbsp; AimAssist: +#{@ship.primaryWeapon.stats.aim}"
        "&nbsp;&nbsp; Damage: &nbsp;&nbsp;&nbsp;+#{@ship.primaryWeapon.stats.damage}"
      ]
      stats = Crafty.e('2D, WebGL, Color, PauseMenu')
        .attr(
          x: (xOff * Crafty.viewport.width)
          y: (Crafty.viewport.height * .3)
          w: (.25 * Crafty.viewport.width)
          h: (statList.length + 5) * 20
          z: 100
          alpha: .3
        )
        .color('#000')
      for o, i in statList
        stat = Crafty.e('2D, UILayerDOM, Text')
          .attr(
            x: stats.x + 20
            y: stats.y + 85 + (20 * i)
            w: stats.w - 60
            z: 110
          )
          .text(o)
          .textColor('#D0D0D0')
          .textAlign 'left'
          .textFont(
            size: '8px'
            weight: 'bold'
            family: 'Press Start 2P'
          )
        stats.attach stat
        if 2 < i < 7
          s = ['speedBoost', 'rapidFireBoost', 'aimBoost', 'damageBoost']
          icon = Crafty.e('2D, WebGL, ColorEffects, PauseMenu').addComponent(s[i - 3])
            .attr(
              x: stats.x + 20
              y: stats.y + 82 + (20 * i)
              w: 12
              h: 12
              z: 110
            )
            .colorOverride('white', 'partial')
          stats.attach icon


  remove: ->
    self = this

    Crafty('Player').each ->
      @unbind 'Up', self._handleUp
      @unbind 'Down', self._handleDown
      @unbind 'Fire', self._handleFire

    Crafty('PauseMenu').each -> @destroy()

module.exports = PauseMenu
