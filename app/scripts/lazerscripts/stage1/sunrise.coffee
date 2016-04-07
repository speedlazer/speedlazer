Game = @Game
Game.Scripts ||= {}

class Game.Scripts.SunRise extends Game.EntityScript

  assets: ->
    @loadAssets('sun')

  spawn: (options) ->
    sun = Crafty('Sun')
    sky = Crafty('Sky').get(0) || Crafty.e('2D, WebGL, Gradient, Sky, HUD, ColorFade').attr(
      w: Crafty.viewport.width
      h: Crafty.viewport.height * .7
    ).positionHud(
      x: 0
      y: 0
      z: -1000
    )

    if sun.length > 0
      sun.attr(
        x: sun.x + Crafty.viewport.x
        y: sun.y + Crafty.viewport.y
        defaultSpeed: options.speed ? 1
      )
    else
      Crafty.e('Sun, KeepAlive')
        .sun(
          x: Crafty.viewport.width * .97
          y: Crafty.viewport.height * .85
          defaultSpeed: options.speed ? 1
        )

  execute: ->
    speed = @options.speed ? 1

    preColor = (40000 / speed)
    colorDuration = (900000 / speed)
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
          ['#ca4331', '#fcaf01', '#f7e459', '#5dade9', '#5ba5ec', '#d6d5d5'],
          ['#222c50', '#7a86a2', '#366eab']
        )
        @movePath [
          [.75, .31]
          [.5, .21]
        ], rotate: no, skip: @options.skipTo - preColor
      )
    )

