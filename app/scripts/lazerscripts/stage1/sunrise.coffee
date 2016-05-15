Game = @Game
Game.Scripts ||= {}

class Game.Scripts.SunRise extends Game.EntityScript

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
        x: (Crafty.viewport.width * .97) - Crafty.viewport.x
        y: (Crafty.viewport.height * .74) - Crafty.viewport.y
        defaultSpeed: options.speed ? 1
      )
    else
      Crafty.e('Sun, KeepAlive')
        .sun(
          x: Crafty.viewport.width * .97
          y: Crafty.viewport.height * .74
          defaultSpeed: options.speed ? 1
        )

  execute: ->
    speed = @options.speed ? 1
    @options.skipTo ?= 0

    preColor = (40000 / speed)
    colorDuration = (600000 / speed)
    @sequence(
      @setLocation x: .97, y: .74
      @backgroundColorFade(
        duration: preColor,
        skip: @options.skipTo,
        ['#000020', '#000020', '#ca4331'],
        ['#000000', '#222c50']
      )
      @parallel(
        @backgroundColorFade(
          duration: colorDuration,
          skip: (@options.skipTo - preColor),
          ['#ca4331', '#fcaf01', '#f7e459', '#d6d5d5', '#d6d5d5']
          ['#222c50', '#7a86a2', '#366eab']
        )
        @movePath [
          [.75, .31]
          [.5, .11]
        ], rotate: no, skip: @options.skipTo - preColor
      )
    )

