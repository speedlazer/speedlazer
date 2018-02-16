defaults = require('lodash/defaults')

# Templates for various actions in the game
# to remove duplication.
# They generally call lower level lazerScript
# methods.
Level =
  oldExplosion: (location, options = {}) ->
    (sequence) =>
      @_verify(sequence)
      { x, y } = location()
      options = defaults(
        { x, y }
        options
        {
          damage: 0
          radius: 20
          duration: 160
          z: 5
          alpha: 1.0
        }
      )
      e = Crafty.e('OldExplosion').explode(
        options
      )
      if options.damage
        e.addComponent('Hostile')

  smallExplosion: (options = {}) ->
    options = defaults(options,
      juice: yes
      offsetX: 0
      offsetY: 0
    )
    if options.juice is no
      @blast(@location())
    else
      @parallel(
        @blast(@location({
          offsetX: options.offsetX
          offsetY: options.offsetY
        }, radius: 10), alpha: .85)
        => Crafty.audio.play("explosion", 1, .25)
      )

  smokePrint: (options = {}) ->
    options = defaults(options,
      juice: yes
      offsetX: 0
      offsetY: 0
    )
    if options.juice is no
      @blast(@location())
    else
      @blast(
        @location({
          offsetX: options.offsetX
          offsetY: options.offsetY
        }),
        =>
          viewportFixed: no
          alpha: 0.3
          z: @entity.z - 3
          lightness: 0.1
          duration: 200
      )

  bigExplosion: (options = {}) ->
    options = defaults(options,
      juice: yes
      offsetX: 0
      offsetY: 0
      damage: 300
    )

    if options.juice is no
      @blast(@location(), damage: options.damage, radius: 40)
    else
      @parallel(
        @addMinorScreenshake()
        => Crafty.audio.play("explosion")
        @blast(@location({
          offsetX: options.offsetX
          offsetY: options.offsetY
        }), damage: options.damage, radius: 40)
      )

module.exports =
  default: Level
