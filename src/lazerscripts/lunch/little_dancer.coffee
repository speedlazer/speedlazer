{ EntityScript } = require('src/lib/LazerScript')

class LittleDancer extends EntityScript

  spawn: (options) ->
    @wallTarget = options.grid.getLocation()
    @index = Math.round((@wallTarget.x - .25) / .1)

    Crafty.e('OldDrone').drone(
      health: 1900
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .56
      defaultSpeed: 200
    )

  execute: ->
    @sequence(
      @if((=> @index is 0),
        @say('Enemy squad', 'Welcome to our little dance!')
      )
      @moveTo(x: @wallTarget.x, speed: 400)
      @synchronizeOn 'placed'

      @moveTo(x: @wallTarget.x + .05)
      @moveTo(y: 305)
      @repeat 2, @sequence(
        @moveTo(x: @wallTarget.x + .1)
        @wait 500
        @moveTo(x: @wallTarget.x + .05)
        @wait 500
      )
      @wait (@index * 500)
      @moveTo(y: .4)
      @wait 100
      @moveTo(y: 1.1)
      @wait 100
      @moveTo(y: .65)
      @synchronizeOn 'afterJump'
      @moveTo(x: .45)
      @movePath([
        [.3, .5]
        [.7, .43]
        [.3, .2]
      ], speed: 200)
      @rotate 0, 100

      @if((=> @index is 0),
        @moveTo(x: .25, y: .25, speed: 400)
      )
      @if((=> @index is 1),
        @moveTo(x: .75, y: .25, speed: 400)
      )
      @if((=> @index is 2),
        @moveTo(x: .75, y: .75, speed: 400)
      )
      @if((=> @index is 3),
        @moveTo(x: .25, y: .75, speed: 400)
      )
      @if((=> @index is 4),
        @moveTo(x: .5, y: .5, speed: 400)
      )
      @synchronizeOn 'detonation'
      @wait 1000
      @oldExplosion(@location(offsetX: 20, offsetY: 20), radius: 40)
    )

module.exports =
  default: LittleDancer
