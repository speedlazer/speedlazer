Game = @Game
Game.ScriptTemplate ?= {}

# Templates for various actions in the game
# to remove duplication.
# They generally call lower level lazerScript
# methods.
Game.ScriptTemplate.Level =
  oldExplosion: (location, options = {}) ->
    (sequence) =>
      @_verify(sequence)
      { x, y } = location()
      x -= Crafty.viewport.x
      y -= Crafty.viewport.y
      options = _.defaults(
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
        e.addComponent('Enemy')

  smallExplosion: (options = {}) ->
    options = _.defaults(options,
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
        }), alpha: .85)
        => Crafty.audio.play("explosion", 1, .25)
        @screenShake(2, duration: 200)
      )

  bigExplosion: (options = {}) ->
    options = _.defaults(options,
      juice: yes
      offsetX: 0
      offsetY: 0
      damage: 300
    )

    if options.juice is no
      @blast(@location(), damage: options.damage, radius: 40)
    else
      @parallel(
        @screenShake(10, duration: 200)
        => Crafty.audio.play("explosion")
        @blast(@location({
          offsetX: options.offsetX
          offsetY: options.offsetY
        }), damage: options.damage, radius: 40)
      )
