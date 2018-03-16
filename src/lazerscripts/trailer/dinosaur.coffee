{ EntityScript } = require('src/lib/LazerScript')
require('src/components/entities/Dinosaur')

class Dinosaur extends EntityScript
  assets: ->
    @loadAssets('dinosaur')

  spawnLocation: (options) ->
    x = Crafty.viewport.width + 40
    x = options.x if options.x
    x = x * Crafty.viewport.width if x < 2 and x > -2
    x = Crafty(options.startAt).get(0).x if options.startAt
    x += options.dx if options.dx

    y = Crafty.viewport.height * .4
    y = options.y if options.y
    y = y * Crafty.viewport.height if y < 2 and y > -2
    y = Crafty(options.startAt).get(0).y if options.startAt
    y += options.dy if options.dy
    return { x, y}

  spawn: (options) ->
    location = @spawnLocation({ x: .5, y: .5 })
    Crafty.e('Dinosaur, KeepAlive').dinosaur(
      x: location.x
      y: location.y
    )

  execute: ->
    @sequence(
      @invincible yes
      @action 'stand'
    )

module.exports = {
  default: Dinosaur
}
