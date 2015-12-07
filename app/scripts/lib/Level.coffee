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
    @bufferLength = 640 * 3
    @generationPosition = x: 0, y: 40
    @sceneryEvents = []
    @visibleHeight = 480 - @generationPosition.y

    { @namespace } = @data
    @currentScenery = @data.startScenery

  setScenery: (scenery) ->
    @_loadAssetsForScenery(scenery).then =>
      @currentScenery = scenery
      @_setupLevelScenery()

  _loadAssetsForScenery: (scenery) ->
    blockType = "#{@namespace}.#{scenery}"
    blockKlass = @generator.buildingBlocks[blockType]
    blockKlass::loadAssets().then =>
      console.log 'assetsLoaded', scenery
      if next = blockKlass::autoNext
        @_loadAssetsForScenery(next)

  start: (settings = {}) ->
    defaults =
      armedPlayers: 'lasers'
      speed: 1
      controlsEnabled: yes
      weaponsEnabled: yes
      spawnPosition:
        x: 100
        y: 200
      spawnOffset:
        x: -50
        y: 0
      viewport:
        x: 0
        y: 0
      title: ''

    settings = _.defaults(settings, @data, defaults)

    Crafty.viewport.x = 0
    Crafty.viewport.y = 0
    @_controlsEnabled = settings.controlsEnabled
    @setForcedSpeed settings.speed
    @setWeaponsEnabled settings.weaponsEnabled

    @_scrollWall = Crafty.e('ScrollWall').attr
      x: settings.viewport.x
      y: settings.viewport.y

    @_playersActive = no

    Crafty.bind 'EnemySpawned', =>
      @data.enemiesSpawned ?= 0
      @data.enemiesSpawned += 1

    @_placePlayerShips settings

    Crafty.e('2D, DOM, Text, HUD, LevelTitle')
      .attr(w: 150, h: 20)
      .positionHud(x: (640 - 150), y: 10, z: 2)
      .textFont(
        size: '12px'
        family: 'Bank Gothic'
      )
      .textColor '#A0A0A0'
      .text settings.title

    @_setupLevelScenery()

    Crafty.bind 'PlayerDied', =>
      playersActive = no
      Crafty('Player ControlScheme').each ->
        playersActive = yes if @lives > 0

      unless playersActive
        @stop()
        Crafty.trigger('GameOver')

    Crafty.bind 'EnterFrame', @_waveTicks

  _waveTicks: (fd) =>
    @_registeredWaveTweens ?= {}
    wt.tick(fd.dt) for n, wt of @_registeredWaveTweens

  registerWaveTween: (name, duration, easing, callback) ->
    @_registeredWaveTweens ?= {}
    @_registeredWaveTweens[name] ?= new (class
      constructor: ({ @name, duration, easing, @callback }) ->
        @ease = new Crafty.easing(duration, easing)
        @ease.repeat 3

      tick: (dt) ->
        @ease.tick(dt)
        v = @ease.value()
        if @ease.loops is 1
          @ease.repeat 3
        forward = (@ease.loops % 2) is 1
        @callback(v, forward)
    )({ name, duration, easing, callback })

  _setupLevelScenery: ->
    return unless @currentScenery?
    return unless @blocks.length is 0
    @_seedPreceedingGeometry()
    @_update()
    @lastUpdate = Crafty.viewport._x + 200

    for block in @blocks when block.x < 640
      block.enter()

    Crafty.bind('ViewportScroll', =>
      if @lastUpdate - Crafty.viewport._x >= 300
        @_update()
        @lastUpdate = Crafty.viewport._x
    )

    Crafty.bind 'LeaveBlock', (block) => #(index) =>
      index = _.indexOf(@blocks, block)
      @_handleSceneryEvents(@blocks[index - 1], 'leave') if index > 0
      @_handleSceneryEvents(block, 'inScreen')
      @_cleanupBuildBlocks()

    Crafty.bind 'EnterBlock', (block) => #(index) =>
      index = _.indexOf(@blocks, block)
      @_handleSceneryEvents(@blocks[index - 1], 'outScreen') if index > 0
      @_handleSceneryEvents(block, 'enter')

    Crafty.bind 'PlayerEnterBlock', (block) => #(index) =>
      index = _.indexOf(@blocks, block)
      @_handleSceneryEvents(@blocks[index - 1], 'playerLeave') if index > 0
      @_handleSceneryEvents(block, 'playerEnter')


  _handleSceneryEvents: (block, eventType) ->
    return unless block?
    block[eventType]()
    for event, index in @sceneryEvents by -1
      if block.name is "#{@namespace}.#{event.sceneryType}" and eventType is event.eventType
        event.callback.apply this
        @sceneryEvents.splice(index, 1)

  notifyScenery: (eventType, sceneryType, callback) ->
    @sceneryEvents.push { eventType, sceneryType, callback }

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
      ship.weaponsEnabled =  @_weaponsEnabled
      ship.disableControl() unless @_controlsEnabled

    Crafty('Player ControlScheme').each ->
      @spawnShip()

  setForcedSpeed: (speed) ->
    @_forcedSpeed = speed
    if @_playersActive
      @_scrollWall.scrollWall(@_forcedSpeed)
    Crafty('PlayerControlledShip').each ->
      @forcedSpeed speed

  setWeaponsEnabled: (onOff) ->
    @_weaponsEnabled = onOff
    Crafty('PlayerControlledShip').each ->
      @weaponsEnabled = onOff

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

  ##
  # Stop the level, clean up event handlers and
  # blocks
  stop: ->
    Crafty.unbind('LeaveBlock')
    Crafty.unbind('EnterBlock')
    Crafty.unbind('ShipSpawned')
    Crafty.unbind('ViewportScroll')
    Crafty.unbind('EnterFrame', @_waveTicks)
    b?.clean() for b in @blocks

  _update: ->
    startX = - Crafty.viewport._x
    endX = startX + @bufferLength

    counter = 0
    overflowThreshold = 10

    while @generationPosition.x < endX and counter < overflowThreshold
      @_generateLevel()
      counter += 1

  _generateLevel: ->
    blockType = "#{@namespace}.#{@currentScenery}"
    @_addBlockToLevel(blockType, {})
    blockKlass = @generator.buildingBlocks[blockType]
    if next = blockKlass::autoNext
      @currentScenery = next

  _addBlockToLevel: (blockType, settings) ->
    klass = @generator.buildingBlocks[blockType]
    #throw new Error("#{blockType} not found") unless klass?
    block = new klass(this, @generator, settings)
    @blocks.push block
    block.build(@generationPosition) #, @blocks.length - 1)
    @generationPosition =
      x: block.x + block.delta.x
      y: block.y + block.delta.y

  _insertBlockToLevel: (blockType, settings) ->
    klass = @generator.buildingBlocks[blockType]
    throw new Error("#{blockType} not found") unless klass?
    block = new klass(this, @generator, settings)
    @blocks.unshift block
    @generationPosition =
      x: @generationPosition.x - block.delta.x
      y: @generationPosition.y - block.delta.y
    block.build(@generationPosition) #, 0)

  _cleanupBuildBlocks: ->
    first = @blocks[0]
    while first.canCleanup()
      @blocks.shift().clean()
      first = @blocks[0]

  _seedPreceedingGeometry: ->
    blockType = "#{@namespace}.#{@currentScenery}"
    blockKlass = @generator.buildingBlocks[blockType]
    if next = blockKlass::autoNext
      blockType = "#{@namespace}.#{next}"

    p = _.clone @generationPosition
    @_insertBlockToLevel(blockType, {})
    @_insertBlockToLevel(blockType, {})
    @_insertBlockToLevel(blockType, {})
    @generationPosition = p


  updateTitle: (newTitle) ->
    Crafty('LevelTitle').text newTitle
