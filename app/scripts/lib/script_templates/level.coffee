Game = @Game
Game.ScriptTemplate ?= {}

# Templates for various actions in the game
# to remove duplication.
# They generally call lower level lazerScript
# methods.
Game.ScriptTemplate.Level =
  explosion2: (location, options = {}, frameOptions) ->
    @parallel(
      @blast(location, options, frameOptions)
      => Crafty.audio.play("explosion", 1, .25)
      @screenShake(2, duration: 200)
    )

