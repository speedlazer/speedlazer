Game = @Game

##
# LevelGenerator
#
# A Level of the game is build up from LevelBlock's
#
# To create a level, these blocks need to be defined
# and registered at the LevelGenerator
#
# a singleton instance of the LevelGenerator is
# accessible through Game.
#
# example:
#
#   class MyBlock extends Game.LevelBlock
#     ...
#
#   Game.levelGenerator.defineBlock MyBlock
#
# With these blocks a level can be created through
# the generator.
#
# level = Game.levelGenerator.createLevel()
#
# metadata can be passed in for the blocks to
# be used and accessed.
#
##
class Game.LevelGenerator

  constructor: ->
    @buildingBlocks = {}

  ##
  # adds a new block for use in levels
  # @param {klass} is a subclass of LevelBlock
  defineBlock: (klass) ->
    @buildingBlocks[klass::name] = klass

  ##
  # Create a new level
  # @param {data} meta data that all pieces in the level can access
  createLevel: (data) ->
    new Game.Level(this, data)

Game.levelGenerator = new Game.LevelGenerator
