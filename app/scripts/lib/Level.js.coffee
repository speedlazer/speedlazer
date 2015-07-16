Game = @Game

##
# Level
#
# The level is used to orchestrate the placement of
# LevelBlock's to form a level.
#
# A level can be created through the LevelGenerator
#
# Optionally, data can be passed in. All the blocks in
# a level can access and use and modify this data.
#
# blocks can be added in 2 ways.
# Manually, through #addBlock and automatically,
# through #generateBlocks
#
# Starting a level:
#
# using #start, the level can be started. This will
# trigger the '#generate' of blocks to build their
# environment for a certain amount of pixels.
#
# Then the camera moves through the level, additional
# blocks will '#generate' and earlier blocks will
# be '#clean'-ed.
#
# during this movement of the camera, each block also
#
# gets 3 triggers to optionally act upon (useful for
# placing enemies or other events)
#
# - #enter The camera start moving into this block
# - #inScreen The block is touching the left side of the camera,
#   and will start moving out-of-view
# - #leave The block has moved out-of-view of the camera
#   this will also cause the '#clean' action
##
class Game.Level

  constructor: (@generator, @data = {}) ->
    @blocks = []
    @bufferLength = 2500
    @generationPosition = x: 0, y: 40
    @visibleHeight = 480 - @generationPosition.y

  ##
  # Manually pick a blocktype and add it to
  # the level.
  # @param {blockType} LevelBlock name to add
  # @param {settings} specific settings to be
  #   used by this block
  addBlock: (blockType, settings = {}) ->
    klass = @generator.buildingBlocks[blockType]
    block = new klass(this, settings)
    @blocks.push block

  ##
  # Generate a certain amount of blocks in
  # sequence. A random pick from the '.next'
  # property from LevelBlock will determine
  # which block will be placed next.
  #
  # This method needs at least one block already
  # placed in the level.
  #
  # @param {amount} amount of blocks to be placed.
  # @param {settings} settings to be passed to all
  #   generated blocks.
  generateBlocks: (amount, settings = {}) ->
    return if @blocks.length is 0
    # Get the current tile type
    lastBlock = @blocks[@blocks.length - 1]
    blockType = lastBlock.name

    for num in [1..amount]
      blockType = @_determineNextTileType blockType, settings
      @addBlock blockType, settings

  ##
  # Start the level, and generation of blocks
  start: ->
    Crafty.viewport.x = 0
    Crafty.viewport.y = 0
    @_update 0
    @blocks[0].enter()
    Crafty.bind 'LeaveBlock', (index) =>
      @_update index
      if index > 0
        @blocks[index].inScreen()
        @blocks[index - 1].leave()
      if index > 1
        @blocks[index - 2].clean()

    Crafty.bind 'EnterBlock', (index) =>
      @blocks[index].enter()

  ##
  # Stop the level, clean up event handlers and
  # blocks
  stop: ->
    Crafty.unbind('LeaveBlock')
    Crafty.unbind('EnterBlock')
    b.clean() for b in @blocks

  # Generate more level from tile 'start'
  _update: (start) ->
    startX = @blocks[start]?.x || 0
    endX = startX + @bufferLength

    for block, i in @blocks when i >= start
      block.build(@generationPosition, i)
      @generationPosition =
        x: block.x + block.delta.x
        y: block.y + block.delta.y
      break if @generationPosition.x > endX

  _determineNextTileType: (blockType, settings) ->
    blockKlass = @generator.buildingBlocks[blockType]
    candidates = blockKlass::next
    maxAllowedRepitition = 2
    blockCount = @blocks.length

    # prevent picking randomly the same tile
    # too many times in sequence
    if blockCount >= maxAllowedRepitition
      repetitionCount = 0

      for block in @blocks by -1
        if block.blockType is blockType
          repetitionCount++
        else
          break

      if repetitionCount >= maxAllowedRepitition
        newCandidates = [] # Make sure repetition does not continue
        for candidate in candidates when candidate isnt blockType
          newCandidates.push candidate
        candidates = newCandidates

    candidates[Math.floor(Math.random() * candidates.length)]

