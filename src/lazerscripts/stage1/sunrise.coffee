{ EntityScript } = require('src/lib/LazerScript')

class SunRise extends EntityScript

  spawn: (options) ->
    sky = Crafty('Sky').get(0) || Crafty.e('2D, WebGL, Gradient, Sky, ColorFade').attr(
      w: Crafty.viewport.width
      h: Crafty.viewport.height * .7
    ).attr(
      x: 0
      y: 0
      z: -1000
    )

    sun = Crafty('Sun')
    if sun.length > 0
      sun.attr(
        defaultSpeed: options.speed ? 1
      )
    else
      Crafty.e('Sun, KeepAlive')
        .sun(
          x: Crafty.viewport.width * .97
          y: Crafty.viewport.height * .74
          defaultSpeed: options.speed ? 1
        )

class StartOfDawn extends SunRise

  execute: ->
    speed = @options.speed ? 1
    @options.skipTo ?= 0

    preColor = (20000 / speed)
    @sequence(
      @setLocation x: .97, y: .74
      @backgroundColorFade(
        duration: preColor,
        skip: @options.skipTo,
        ['#000000', '#000020', '#000020', '#7e261b'],
        ['#000000', '#000000', '#000020', '#222c50']
      )
    )

class FullSunRise extends SunRise

  execute: ->
    speed = @options.speed ? 1
    @options.skipTo ?= 0

    preColor = (80000 / speed)
    colorDuration = (600000 / speed)
    @sequence(
      @setLocation x: .97, y: .74
      @backgroundColorFade(
        duration: preColor,
        skip: @options.skipTo,
        ['#000000', '#000020', '#000020', '#7e261b'],
        ['#000000', '#000000', '#000020', '#222c50']
      )
      @parallel(
        @backgroundColorFade(
          duration: colorDuration,
          skip: (@options.skipTo - preColor),
          ['#7e261b', '#d39915', '#f7e459', '#d6d5d5', '#d6d5d5']
          ['#222c50', '#7a86a2', '#366eab']
        )
        @movePath [
          [.75, .31]
          [.5, .11]
        ], rotate: no, skip: @options.skipTo - preColor
      )
    )

class DayBreak extends SunRise

  execute: ->
    speed = @options.speed ? 1
    @options.skipTo ?= 0

    colorDuration = (45000 / speed)
    @sequence(
      @setLocation x: .97, y: .74
      @parallel(
        @backgroundColorFade(
          duration: colorDuration,
          skip: (@options.skipTo),
          ['#7e261b', '#d39915', '#e8b32c']
          ['#222c50', '#7a86a2', '#606aa5']
        )
        @movePath [
          [.75, .61]
        ], rotate: no, skip: @options.skipTo, speed: speed * 10
      )
    )

class Morning extends SunRise

  execute: ->
    speed = @options.speed ? 1
    @options.skipTo ?= 0

    colorDuration = (120000 / speed)
    @sequence(
      @setLocation x: .75, y: .61
      @parallel(
        @backgroundColorFade(
          duration: colorDuration,
          skip: (@options.skipTo),
          ['#e8b32c', '#f0b722']
          ['#606aa5', '#c099cc']
        )
        @movePath [
          [.71, .45]
        ], rotate: no, skip: @options.skipTo, speed: speed * 2
      )
    )

class Noon extends SunRise

  execute: ->
    speed = @options.speed ? 1
    @options.skipTo ?= 0

    colorDuration = (80000 / speed)
    @parallel(
      @setLocation x: .71, y: .45
      @backgroundColorFade(
        duration: colorDuration,
        skip: (@options.skipTo),
        ['#f0b722', '#f7e459', '#d6d5d5', '#d6d5d5']
        ['#c099cc', '#366eab', '#366eab']
      )
      @movePath [
        [.4, .1]
      ], rotate: no, skip: @options.skipTo, speed: speed * 3
    )

module.exports = {
  StartOfDawn
  DayBreak
  Morning
  Noon
}
