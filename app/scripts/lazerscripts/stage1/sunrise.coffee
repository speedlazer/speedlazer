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
      Crafty.e('Sun, ColorFade')
        .sun(
          x: 620
          y: 340
          speed: 2
        )

  execute: ->
    @sequence(
      @moveTo x: 620, y: 340, speed: 2000
      @parallel(
        @backgroundColorFade duration: 150000, '#602020', '#8080FF'
        @movePath [
          [420, 150]
          [320, 100]
        ], rotate: no
        @colorFade duration: 300000, '#DD8000', '#DDDD00', '#DDDD80'
      )
    )

