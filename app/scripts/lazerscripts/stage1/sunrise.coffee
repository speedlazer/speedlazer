Game = @Game
Game.Scripts ||= {}

class Game.Scripts.SunRise extends Game.EntityScript

  spawn: (options) ->
    sun = Crafty('Sun, ColorFade')
    if sun.length > 0
      sun.attr(
        x: sun.x + Crafty.viewport.x
        y: sun.y + Crafty.viewport.y
      )
    else
      Crafty.e('Sun, ColorFade, KeepAlive')
        .sun(
          x: 620
          y: 340
          speed: 2
        )

  execute: ->
    @sequence(
      @setLocation x: 620, y: 340
      @backgroundColorFade duration: 50000, skip: @options.skipTo, '#000020', '#402020'
      @parallel(
        @backgroundColorFade duration: 200000, skip: (@options.skipTo - 50000), '#402020', '#7070CC', '#8080FF'
        @movePath [
          [420, 150]
          [320, 100]
        ], rotate: no, skip: @options.skipTo - 50000
        #@colorFade duration: 600000, skip: (@options.skipTo - 50000), '#DD8000', '#DDDD00', '#DDDD80'
      )
    )

