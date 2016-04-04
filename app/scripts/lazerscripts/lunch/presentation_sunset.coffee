Game = @Game
Game.Scripts ||= {}

class Game.Scripts.PresentationSunSet extends Game.EntityScript

  spawn: (options) ->
    sun = Crafty('Sun')
    if sun.length > 0
      sun.attr(
        defaultSpeed: options.speed ? 1
      )
    else
      Crafty.e('Sun, KeepAlive')
        .sun(
          defaultSpeed: options.speed ? 1
        )

  execute: ->
    speed = @options.speed ? 1

    preColor = (40000 / speed)
    colorDuration = (400000 / speed)
    @sequence(
      @setLocation x: .5, y: .31
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

