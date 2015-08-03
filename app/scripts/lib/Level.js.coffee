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
    @levelDefinition = []
    @buildedBlocks = []
    @bufferLength = 640 * 4
    @generationPosition = x: 0, y: 40
    @visibleHeight = 480 - @generationPosition.y

  ##
  # Manually pick a blocktype and add it to
  # the level.
  # @param {blockType} LevelBlock name to add
  # @param {settings} specific settings to be
  #   used by this block
  addBlock: (blockType, settings = {}) ->
    @levelDefinition.push { type: 'block', blockType, settings }

  ##
  # Generate a certain amount of blocks in
  # sequence. A random pick from the '.next'
  # property from LevelBlock will determine
  # which block will be placed next.
  #
  # This method needs at least one block already
  # placed in the level.
  #
  # @param settings the settings to be passed to all
  #   generated blocks.
  # @option settings [Number] amount the amount of blocks to generate
  # @option settings [Function] until keep generating level until
  #   the provided function returns true
  # @option settings [String] stopBefore generate until the provided
  #   blocktype can fit after the last block in the level
  generateBlocks: (settings = {}) ->
    @levelDefinition.push { type: 'generation', settings }

  ##
  # Start the level, and generation of blocks
  start: ->
    Crafty.viewport.x = 0
    Crafty.viewport.y = 0
    @_forcedSpeed = 1
    @_update 0

    for block in @blocks when block.x < 640
      block.enter()

    Crafty.bind 'LeaveBlock', (index) =>
      @_update index
      if index > 0
        @blocks[index - 1].leave()
        @blocks[index].inScreen()

      @_cleanupBuildBlocks()
    @_scrollWall = Crafty.e('ScrollWall')
    @_playersActive = no

    Crafty.one 'ShipSpawned', =>
      @_playersActive = yes
      @_scrollWall.scrollWall(@_forcedSpeed)

    Crafty.bind 'ShipSpawned', (ship) =>
      ship.forcedSpeed(@_forcedSpeed)

    Crafty.bind 'EnterBlock', (index) =>
      if index > 0
        @blocks[index - 1].outScreen()
      @blocks[index].enter()

    Crafty('Player').each (index) ->
      @addComponent('ShipSpawnable').spawnPosition(140, 300 + (index * 50))
      Crafty.e('PlayerInfo').playerInfo(30 + (index * 180), this)

    Crafty('Player ControlScheme').each -> @spawnShip()

  setForcedSpeed: (speed) ->
    @_forcedSpeed = speed
    if @_playersActive
      @_scrollWall.scrollWall(@_forcedSpeed)
    Crafty('PlayerControlledShip').each ->
      @forcedSpeed speed

  ##
  # Stop the level, clean up event handlers and
  # blocks
  stop: ->
    Crafty.unbind('LeaveBlock')
    Crafty.unbind('EnterBlock')
    Crafty.unbind('ShipSpawned')
    b.clean() for b in @blocks

  # Generate more level from tile 'start'
  _update: (start) ->
    @generationDefinition ?= 0

    startX = @blocks[start]?.x || 0
    endX = startX + @bufferLength

    counter = 0
    overflowThreshold = 10

    while @generationPosition.x < endX and @generationDefinition < @levelDefinition.length and counter < overflowThreshold
      currentGenerator = @levelDefinition[@generationDefinition]
      @_generateLevel currentGenerator
      counter += 1

  _generateLevel: (generator) ->
    if generator.type is 'block'
      @_generatePredefinedBlock generator
    else if generator.type is 'generation'
      @_generateBlocks generator
    else
      console.log 'no support yet for', generator.type

  _generatePredefinedBlock: (generator) ->
    @_addBlockToLevel generator.blockType, generator.settings
    @generationDefinition += 1 # add a block once

  _addBlockToLevel: (blockType, settings) ->
    klass = @generator.buildingBlocks[blockType]
    throw new Error("#{blockType} not found") unless klass?
    block = new klass(this, settings)
    @blocks.push block
    block.build(@generationPosition, @blocks.length - 1)
    @generationPosition =
      x: block.x + block.delta.x
      y: block.y + block.delta.y

  _generateBlocks: (generator) ->
    return if @blocks.length is 0
    # Get the current tile type
    lastBlock = @blocks[@blocks.length - 1]
    blockType = lastBlock.name

    settings = generator.settings

    amount = settings.amount ? 30

    if settings.stopBefore? and settings.stopBefore is blockType
      @generationDefinition += 1 # done!
      return

    if amount <= (generator.amountGenerated ? 0)
      @generationDefinition += 1 # done!
      return

    if settings.until?.apply(this)
      @generationDefinition += 1 # done!
      return

    blockType = @_determineNextTileType blockType, settings
    if settings.stopBefore? and settings.stopBefore is blockType
      @generationDefinition += 1 # done!
      return

    @_addBlockToLevel blockType, settings
    generator.amountGenerated ?= 0
    generator.amountGenerated += 1

  _cleanupBuildBlocks: ->
    keep = []
    for block in @buildedBlocks
      if block.canCleanup()
        block.clean()
      else
        keep.push block
    @buildedBlocks = keep

  _determineNextTileType: (blockType, settings) ->
    blockKlass = @generator.buildingBlocks[blockType]
    candidates = blockKlass::next
    if candidates.length is 0
      throw 'TODO: Look back in blocks to get point for generation'

    return settings.stopBefore if settings.stopBefore? and candidates.indexOf(settings.stopBefore) isnt -1

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
          break if block.delta.x > 0

      if repetitionCount >= maxAllowedRepitition
        newCandidates = [] # Make sure repetition does not continue
        for candidate in candidates when candidate isnt blockType
          newCandidates.push candidate
        candidates = newCandidates

    candidates[Math.floor(Math.random() * candidates.length)]

