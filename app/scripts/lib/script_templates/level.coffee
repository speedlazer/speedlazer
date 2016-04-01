Game = @Game
Game.ScriptTemplate ?= {}

# Templates for various actions in the game
# to remove duplication.
# They generally call lower level lazerScript
# methods.
Game.ScriptTemplate.Level =
  oldExplosion: (location) ->
    (sequence) =>
      @_verify(sequence)
      { x, y } = location()
      x -= Crafty.viewport.x
      y -= Crafty.viewport.y
      options = {}
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

  smallExplosion: ->
    @parallel(
      @blast(@location())
      => Crafty.audio.play("explosion", 1, .25)
      @screenShake(2, duration: 200)
    )

  bigExplosion: ->
    @parallel(
      @screenShake(10, duration: 200)
      => Crafty.audio.play("explosion")
      @blast(@location(), damage: 300, radius: 40)
    )
