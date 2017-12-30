defaults = require('lodash/defaults')
isEmpty = require('lodash/isEmpty')
clone = require('lodash/clone')

###

# Level

The level is used to orchestrate the placement of
LevelBlock's to form a level.showDialog: ->
new @Game.Dialog @settings.dialog
A level can be created through the LevelGenerator

Optionally, data can be passed in. All the blocks in
a level can access and use and modify this data.

###

class Game.Level
  constructor: (@generator, @data = {}) ->
    @blocks = []
    @bufferLength = Crafty.viewport.width * 3
    @generationPosition = x: 0, y: 40
    @sceneryEvents = []
    @visibleHeight = Crafty.viewport.height - @generationPosition.y
    @shipType = 'PlayerSpaceship'

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
      nextLoading = []
      if prev = blockKlass::autoPrevious
        nextLoading.push => @_loadAssetsForScenery(prev)
      if next = blockKlass::autoNext
        nextLoading.push => @_loadAssetsForScenery(next)
      if nextLoading.length > 0
        WhenJS.sequence(nextLoading)

  start: ->
    @active = yes
    Crafty.viewport.x = 0
    Crafty.viewport.y = 0
    @_controlsEnabled = yes
    @setForcedSpeed 1
    @setWeaponsEnabled yes

    @_scrollWall = Crafty.e('ScrollWall').attr
      x: 0
      y: 0

    @_playersActive = no

    Crafty.bind 'EnemySpawned', =>
      @data.enemiesSpawned ?= 0
      @data.enemiesSpawned += 1

    Crafty.e('2D, UILayerDOM, Text, LevelTitle')
      .attr(w: 250, h: 20)
      .attr(x: (Crafty.viewport.width - 250), y: 10, z: 2)
      .textFont(
        size: '10px'
        family: 'Press Start 2P'
      )
      .textColor '#A0A0A0'
      .text ''

    @_setupLevelScenery()

    Crafty.bind 'PlayerDied', =>
      playersActive = no
      Crafty('Player ControlScheme').each ->
        playersActive = yes if @lives > 0

      unless playersActive
        @stop()
        Crafty.trigger('GameOver')

    Crafty.bind 'GameLoop', @_waveTicks

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

    @_placePlayerShips()

    @_seedPreceedingGeometry()
    @_update()

    for block in @blocks when block.x < 640
      block.enter()

    Crafty.bind('ViewportMove', ({ dx, dy }) =>
      @generationPosition.x -= dx
      @generationPosition.y -= dy
      if @generationPosition.x < @bufferLength
        @_update()
    )

    Crafty.uniqueBind 'LeaveBlock', (block) => #(index) =>
      index = @blocks.indexOf(block)
      @_handleSceneryEvents(@blocks[index - 1], 'leave') if index > 0
      @_handleSceneryEvents(block, 'inScreen')
      @_cleanupBuildBlocks()

    Crafty.uniqueBind 'EnterBlock', (block) => #(index) =>
      index = @blocks.indexOf(block)
      @_handleSceneryEvents(@blocks[index - 1], 'outScreen') if index > 0
      @_handleSceneryEvents(block, 'enter')

    Crafty.uniqueBind 'PlayerEnterBlock', (block) => #(index) =>
      index = @blocks.indexOf(block)
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

  _placePlayerShips: ->
    defaultValues =
      spawnPosition:
        x: 100
        y: 200
      spawnOffset:
        x: -50
        y: 0
      title: ''

    settings = defaults(@data, defaultValues)

    Crafty.one 'ShipSpawned', =>
      @_playersActive = yes
      @_scrollWall.scrollWall(@_forcedSpeed)

    Crafty('Player').each (index) ->
      spawnPosition = ->
        pos = clone settings.spawnPosition
        Crafty('PlayerControlledShip').each ->
          pos.x = @x + settings.spawnOffset.x + Crafty.viewport.x
          pos.y = @y + settings.spawnOffset.y + Crafty.viewport.y
        pos

      @addComponent('ShipSpawnable').spawnPosition(spawnPosition)

      Crafty.e('PlayerInfo').playerInfo(30 + (index * (Crafty.viewport.width * .3)), this)

    Crafty.bind 'ShipSpawned', (ship) =>
      ship.forcedSpeed @_forcedSpeed, accellerate: no
      ship.weaponsEnabled =  @_weaponsEnabled[ship.playerNumber]
      ship.disableControl() unless @_controlsEnabled

      if @playerStartWeapons?
        ship.clearItems()
        for item in @playerStartWeapons
          itemSettings = @inventory(item)
          ship.installItem itemSettings

    Crafty('Player ControlScheme').each ->
      @spawnShip()

  inventory: (name) ->
    @invItems ||= {}
    @invItems[name]

  inventoryAdd: (type, name, options) ->
    @invItems ||= {}
    @invItems[name] ||= defaults(options,
      type: type
      contains: name
    )

  getShipType: -> @shipType
  setShipType: (@shipType) ->
    Crafty('Player ControlScheme').each -> @spawnShip() if @ship?

  setForcedSpeed: (speed, options) ->
    options = defaults(options,
      accellerate: yes
    )
    if @_forcedSpeed
      delta = (speed.x ? speed) - (@_forcedSpeed.x ? @_forcedSpeed)
    else
      delta = 0
    @_forcedSpeed = speed
    if @_playersActive
      @_scrollWall.scrollWall(@_forcedSpeed, options)
    #Crafty('Bullet').each -> @attr speed: @speed + delta
    Crafty('PlayerControlledShip').each ->
      @forcedSpeed speed, options

  screenShake: (amount, options = {}) ->
    options = defaults(options, {
      duration: 1000
    })
    @_scrollWall.screenShake(amount, options.duration)

  cameraPan: (options = {}) ->
    options = defaults(options, {
      y: 0
      x: 0
      duration: 1000
    })
    #@_scrollWall.cameraPan(options)

  setHeight: (deltaY) ->
    #@_scrollWall.setHeight deltaY
    #Crafty('PlayerControlledShip').each ->
      #@y += deltaY

  setWeaponsEnabled: (onOff, players) ->
    players = [1, 2] unless players? and !isEmpty(players)
    @_weaponsEnabled ?= {}
    @_weaponsEnabled[player] = onOff for player in players
    Crafty('PlayerControlledShip').each ->
      @weaponsEnabled = onOff if @playerNumber in players

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
    @active = no
    Crafty.unbind('LeaveBlock')
    Crafty.unbind('EnterBlock')
    Crafty.unbind('ShipSpawned')
    Crafty.unbind('ViewportMove')
    Crafty.unbind('GameLoop', @_waveTicks)
    b?.clean() for b in @blocks

  verify: ->
    throw new Error('sequence mismatch') unless @active

  _update: ->
    endX = @bufferLength

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
    if prev = blockKlass::autoPrevious
      blockType = "#{@namespace}.#{prev}"

    p = clone @generationPosition
    @_insertBlockToLevel(blockType, {})
    @_insertBlockToLevel(blockType, {})
    @_insertBlockToLevel(blockType, {})
    @generationPosition = p

  loadAssets: (names) ->
    @generator.loadAssets names

  setStartWeapons: (@playerStartWeapons) ->

