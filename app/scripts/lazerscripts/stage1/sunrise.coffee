Game = @Game
Game.Scripts ||= {}

class Game.Scripts.SunRise extends Game.EntityScript

  assets: ->
    @loadAssets('sun',
      sprites:
        'sun.png':
          tile: 1
          tileh: 1
          map:
            sun: [0,0,35,35]
            directGlare: [0,81,175,175]
            redGlare: [0,36,10,10]
            blueGlare: [120, 0, 80, 80]
            bigGlare: [0, 256, 200, 200]
    )

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
          x: Crafty.viewport.width * .97
          y: Crafty.viewport.height * .85
          speed: options.speed ? 1
        )

  execute: ->
    speed = @options.speed ? 1

    preColor = (40000 / speed)
    colorDuration = (400000 / speed)
    @sequence(
      @setLocation x: .97, y: .74
      @backgroundColorFade duration: preColor, skip: @options.skipTo, '#000020', '#d88442'
      @parallel(
        @backgroundColorFade duration: colorDuration, skip: (@options.skipTo - preColor), '#d88442', '#FFFe82', '#5dade9', '#5dade9', '#5dade9', '#5dade9'
        @movePath [
          [.65, .31]
          [.5, .21]
        ], rotate: no, skip: @options.skipTo - preColor
      )
    )

