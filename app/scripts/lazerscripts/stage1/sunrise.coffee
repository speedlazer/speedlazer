Game = @Game
Game.Scripts ||= {}

class Game.Scripts.SunRise extends Game.EntityScript

  spawn: (options) ->
    sun = Crafty('Sun')
    if sun.length > 0
      sun.attr(
        x: sun.x + Crafty.viewport.x
        y: sun.y + Crafty.viewport.y
      )
    else
      Crafty.e('Sun, KeepAlive')
        .sun(
          x: 620
          y: 340
          speed: options.speed ? 2
        )

  execute: ->
    speed = @options.speed ? 2
    preColor = (100000 / speed)
    colorDuration = (400000 / speed)
    @sequence(
      @setLocation x: 620, y: 340
      @backgroundColorFade duration: preColor, skip: @options.skipTo, '#000020', '#402020'
      @parallel(
        @backgroundColorFade duration: colorDuration, skip: (@options.skipTo - preColor), '#402020', '#7070CC', '#8080FF'
        @movePath [
          [420, 150]
          [320, 100]
        ], rotate: no, skip: @options.skipTo - 50000
      )
    )

