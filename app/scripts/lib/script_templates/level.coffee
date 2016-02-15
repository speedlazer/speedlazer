Game = @Game
Game.ScriptTemplate ?= {}

# Templates for various actions in the game
# to remove duplication.
# They generally call lower level lazerScript
# methods.
Game.ScriptTemplate.Level =
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

