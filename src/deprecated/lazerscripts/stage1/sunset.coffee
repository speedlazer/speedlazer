{ EntityScript } = require('src/lib/LazerScript')

class SunSet extends EntityScript

  spawn: (options) ->
    sun = Crafty('Sun')
    if sun.length > 0
      sun.attr(
        x: sun.x
        y: sun.y
      )
    else
      Crafty.e('Sun, ColorFade, KeepAlive')
        .sun(
          x: 620
          y: 340
          defaultSpeed: 2
        )

  execute: ->
    @sequence(
      @moveTo x: 320, y: 100, speed: 2000
      @backgroundColorFade duration: 1, '#8080FF'
      @parallel(
        @movePath [
          [220, 120]
          [120, 320]
          [20, 420]
        ], rotate: no
        @colorFade duration: 300000, '#DDDD80', '#DDDD00', '#DD8000'
        @sequence(
          @wait 150000
          @backgroundColorFade duration: 150000, '#8080FF', '#602020'
        )
      )
    )

module.exports =
  SunSet
