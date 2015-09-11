###

# Level

The level is used to orchestrate the placement of
LevelBlock's to form a level.showDialog: ->
new @Game.Dialog @settings.dialog
A level can be created through the LevelGenerator

Optionally, data can be passed in. All the blocks in
a level can access and use and modify this data.

###

Game = @Game

class Game.Level

  constructor: (@generator, @data = {}) ->
    @blocks = []
    @levelDefinition = []
    @buildedBlocks = []
    @bufferLength = 640 * 4
    @generationPosition = x: 0, y: 40
    @visibleHeight = 480 - @generationPosition.y

  ###
  blocks can be added in 2 ways.
  Manually, through #addBlock and automatically,

  Manually pick a blocktype and add it to
  the level.

  @param {blockType} LevelBlock name to add
  @param {settings} specific settings to be
   used by this block
  ###
  addBlock: (blockType, settings = {}) ->
    @levelDefinition.push { type: 'block', blockType, settings }


  ###
  through #generateBlocks

  Generate a certain amount of blocks in
  sequence. A random pick from the '.next'
  property from LevelBlock will determine
  which block will be placed next.

  This method needs at least one block already
  placed in the level.

  @param {object} settings the settings to be passed to all
    generated blocks.
  @option {number} settings amount the amount of blocks to generate
  @option settings [Function] until keep generating level until
    the provided function returns true
  @option settings [String] stopBefore generate until the provided
    blocktype can fit after the last block in the level

  ###
  generateBlocks: (settings = {}) ->
    @levelDefinition.push { type: 'generation', settings }

  ###
  Starting a level:

  using #start, the level can be started. This will
  trigger the '#generate' of blocks to build their
  environment for a certain amount of pixels.

  Then the camera moves through the level, additional
  blocks will '#generate' and earlier blocks will
  be '#clean'-ed.

  during this movement of the camera, each block also

  gets 3 triggers to optionally act upon (useful for
  placing enemies or other events)

  - #enter The camera start moving into this block
  - #inScreen The block is touching the left side of the camera,
    and will start moving out-of-view
  - #leave The block has moved out-of-view of the camera
    this will also cause the '#clean' action

  ###
  start: (settings = {}) ->
    defaults =
      armedPlayers: yes
      speed: 1
      controlsEnabled: yes
      spawnPosition:
        x: 100
        y: 200
      spawnOffset:
        x: -50
        y: 0
      viewport:
        x: 0
        y: 0

    settings[k] ?= v for k, v of defaults

    Crafty.viewport.x = 0
    Crafty.viewport.y = 0
    @_controlsEnabled = settings.controlsEnabled
    @setForcedSpeed settings.speed

    @_scrollWall = Crafty.e('ScrollWall').attr
      x: settings.viewport.x
      y: settings.viewport.y

    @_playersActive = no

    Crafty.bind 'EnemySpawned', =>
      @data.enemiesSpawned ?= 0
      @data.enemiesSpawned += 1

    @_placePlayerShips settings
    @_update 0

    for block in @blocks when block.x < 640
      block.enter()

    Crafty.bind 'LeaveBlock', (index) =>
      @_update index
      if index > 0
        @blocks[index - 1].leave()
        @currentBlockIndex = index
        @blocks[index].inScreen()

      @_cleanupBuildBlocks()

    Crafty.bind 'EnterBlock', (index) =>
      if index > 0
        @blocks[index - 1].outScreen()
      @newBlockIndex = index
      @blocks[index].enter()

    Crafty.bind 'PlayerEnterBlock', (index) =>
      if index > 0
        @blocks[index - 1]?.playerLeave()
      @blocks[index]?.playerEnter()

  _placePlayerShips: (settings) ->
    Crafty.one 'ShipSpawned', =>
      @_playersActive = yes
      @_scrollWall.scrollWall(@_forcedSpeed)

    Crafty('Player').each (index) ->
      spawnPosition = ->
        pos = _.clone settings.spawnPosition
        Crafty('PlayerControlledShip').each ->
          pos.x = @x + settings.spawnOffset.x + Crafty.viewport.x
          pos.y = @y + settings.spawnOffset.y + Crafty.viewport.y
        pos

      @addComponent('ShipSpawnable').spawnPosition(spawnPosition, settings.armedPlayers)

      Crafty.e('PlayerInfo').playerInfo(30 + (index * 180), this)

    Crafty.bind 'ShipSpawned', (ship) =>
      ship.forcedSpeed @_forcedSpeed
      ship.disableControl() unless @_controlsEnabled

    Crafty('Player ControlScheme').each ->
      @spawnShip()

  setForcedSpeed: (speed) ->
    @_forcedSpeed = speed
    if @_playersActive
      @_scrollWall.scrollWall(@_forcedSpeed)
    Crafty('PlayerControlledShip').each ->
      @forcedSpeed speed

  showDialog: (dialog, callback) ->
    new Game.Dialog dialog, this, callback

  spawnEnemies: (formation, enemyComponent, callback) ->
    formationClass = Game.EnemyFormation[formation]
    formations = _.keys Game.EnemyFormation
    throw new Error("Not a valid formation: #{formation}. " +
      "Use one of: #{formations.join ','}") unless formationClass?
    new formationClass(this, enemyComponent, callback)

  getComponentOffset: ->
    x: @_scrollWall.x
    y: @_scrollWall.y

  addComponent: (c, relativePosition, offset = null) ->
    block = @blocks[@currentBlockIndex ? 0]
    return unless block?
    unless offset?
      offset = @getComponentOffset()
    position =
      x: relativePosition.x + offset.x - block.x
      y: relativePosition.y + offset.y - block.y

    block.add(position.x, position.y, c)

  finishStage: ->
    # start showing player stats and counting scores...
    Crafty.e('StageEnd').stageEnd this

  ##
  # Stop the level, clean up event handlers and
  # blocks
  stop: ->
    Crafty.unbind('LeaveBlock')
    Crafty.unbind('EnterBlock')
    Crafty.unbind('ShipSpawned')
    Crafty.unbind('ViewportScroll')
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

