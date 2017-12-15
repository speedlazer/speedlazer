Game = require('src/scripts/game')
Game.Scripts ||= {}

class Game.Scripts.PresentationLeaveScreen extends Game.EntityScript

  spawn: (options) ->
    ship = undefined
    Crafty('PlayerControlledShip').each ->
      ship = this if @playerNumber is options.index + 1
    if ship?
      ship.addComponent 'Tween', 'Choreography', 'ViewportFixed', 'AnimationMode'
    ship

  execute: ->
    @sequence(
      @rotate 0, 200
      @moveTo x: .2, y: .45 + (@options.index * .1), speed: 100, easing: 'easeInOutQuad'
      @synchronizeOn 'waveOff'
      @wait 2000
      @wait 300 * @options.index
      @moveTo x: 1.1, y: .45 + (@options.index * .1), speed: 500, easing: 'easeInQuad'
    )


