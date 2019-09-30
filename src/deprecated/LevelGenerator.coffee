Level = require('./Level').default

##
# LevelGenerator
#
# A Level of the game is build up from LevelScenery's
#
# To create a level, these blocks need to be defined
# and registered at the LevelGenerator
#
# a singleton instance of the LevelGenerator is
# accessible through Game.
#
# example:
#
#   class MyBlock extends LevelScenery
#     ...
#
#   levelGenerator.defineBlock(MyBlock)
#
# With these blocks a level can be created through
# the generator.
#
# level = levelGenerator.createLevel()
#
# metadata can be passed in for the blocks to
# be used and accessed.
#
##
class LevelGenerator

  constructor: ->
    @buildingBlocks = {}
    @elements = {}
    @assets = {}

  ##
  # adds a new block for use in levels
  # @param {klass} is a subclass of LevelScenery
  defineBlock: (klass) ->
    @buildingBlocks[klass::name] = klass

  defineElement: (name, constructor) ->
    @elements[name] = constructor

  defineAssets: (name, object) ->
    @assets[name] = object

  loadAssets: (names) ->
    p = (@_loadAssetMap name for name in names)
    WhenJS.all p

  _loadAssetMap: (name) ->
    @entityAssets ?= {}

    assetMap = null
    assetObject = null
    for assetName, object of @assets
      if name in object.contents
        assetMap = assetName
        assetObject = object

    throw new Error("no asset map defined for #{name}") unless assetMap

    return @entityAssets[assetMap].promise if @entityAssets[assetMap]
    d = WhenJS.defer()
    @entityAssets[assetMap] =
      assets: assetObject
      promise: d.promise

    sprite = assetObject.spriteMap
    queue = for mapping, items of assetObject.sprites
      obj = { sprites: {} }
      obj.sprites[sprite] = items
      obj

    queue[0].audio = assetObject.audio

    Crafty.load(
      queue.pop()
      ->
        while queue.length > 0
          current = queue.pop().sprites[sprite]
          fileUrl = Crafty.paths().images + sprite
          Crafty.sprite(current.tile, current.tileh, fileUrl, current.map,
            current.paddingX, current.paddingY, current.paddingAroundBorder)
        d.resolve()
    )

    d.promise

  ##
  # Create a new level
  # @param {data} meta data that all pieces in the level can access
  createLevel: (data = { namespace: 'City' }) ->
    new Level(this, data)

levelGenerator = new LevelGenerator

module.exports = levelGenerator
