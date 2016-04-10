Game = @Game
Game.Scripts ||= {}

class Game.Scripts.PresentationSunSet extends Game.EntityScript

  spawn: (options) ->
    sky = Crafty('Sky').get(0) || Crafty.e('2D, WebGL, Gradient, Sky, HUD, ColorFade').attr(
      w: Crafty.viewport.width
      h: Crafty.viewport.height * .7
    ).positionHud(
      x: 0
      y: 0
      z: -1000
    )
    sun = Crafty('Sun')
    if sun.length > 0
      sun.attr(
        x: (Crafty.viewport.width * .5) - Crafty.viewport.x
        y: (Crafty.viewport.height * .11) - Crafty.viewport.y
        defaultSpeed: options.speed ? 1
      )
    else
      Crafty.e('Sun, KeepAlive')
        .sun(
          x: Crafty.viewport.width * .5
          y: Crafty.viewport.height * .11
          defaultSpeed: options.speed ? 1
        )

  execute: ->
    speed = @options.speed ? 1

    preColor = (40000 / speed)
    colorDuration = (400000 / speed)
    @sequence(
      @setLocation x: .5, y: .11
      @parallel(
        @backgroundColorFade(
          duration: colorDuration,
          skip: (@options.skipTo - preColor),
          ['#5dade9', '#7a86a2', '#222c50'],
          ['#5dade9', '#7a86a2', '#222c50']
        )
        @movePath [
          [.35, .8]
        ], rotate: no, skip: @options.skipTo - preColor
      )
      @backgroundColorFade(
        duration: preColor,
        skip: @options.skipTo,
        ['#222c50', '#000000'],
        ['#222c50', '#000000']
      )
    )

