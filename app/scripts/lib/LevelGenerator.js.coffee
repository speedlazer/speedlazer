class LevelGenerator

  constructor: ->
    @buildingBlocks = {}

  defineBlock: (klass) ->
    @buildingBlocks[klass::name] = klass

  createLevel: (data) ->
    new Level(this, data)

class Level

  constructor: (@generator, @data) ->
    @blocks = []
    @bufferLength = 2500
    @generationPosition = x: 0, y: 50

  addBlock: (tileType, settings = {}) ->
    klass = @generator.buildingBlocks[tileType]
    block = new klass(this, settings)
    @blocks.push block

  generateBlocks: (amount, settings = {}) ->
    return if @blocks.length is 0
    # Get the current tile type
    lastBlock = @blocks[@blocks.length - 1]
    tileType = lastBlock.name

    for num in [1..amount]
      tileType = @_determineNextTileType tileType, settings
      @addBlock tileType, settings

  start: ->
    @_update 0
    @blocks[0].enter()
    Crafty.bind 'LeaveBlock', (index) =>
      @_update index
      if index > 0
        @blocks[index - 1].leave()
        @blocks[index].inScreen()

    Crafty.bind 'EnterBlock', (index) =>
      @blocks[index].enter()

  stop: ->
    Crafty.unbind('LeaveBlock')
    Crafty.unbind('EnterBlock')

    for b in @blocks
      b.clean()

  _update: (start) ->
    startX = @blocks[start]?.x || 0
    endX = startX + @bufferLength

    for block, i in @blocks when i >= start
      block.build(@generationPosition, i)
      @generationPosition =
        x: block.x + block.delta.x
        y: block.y + block.delta.y

      break if @generationPosition.x > endX

  _determineNextTileType: (tileType, settings) ->
    blockKlass = @generator.buildingBlocks[tileType]
    candidates = blockKlass::next
    maxAllowedRepitition = 2
    blockCount = @blocks.length

    if blockCount >= maxAllowedRepitition
      repetitionCount = 0

      for block in @blocks by -1
        if block.tileType is tileType
          repetitionCount++
        else
          break

      if repetitionCount >= maxAllowedRepitition
        newCandidates = [] # Make sure repetition does not continue
        for candidate in candidates when candidate isnt tileType
          newCandidates.push candidate
        candidates = newCandidates

    candidates[Math.floor(Math.random() * candidates.length)]


class LevelBlock
  constructor: (@level, @settings) ->
    @createdElements = []
    @createdBindings = []

  build: (pos, index) ->
    return if @generated
    @x ?= pos.x
    @y ?= pos.y
    @generated = yes
    @generate()
    @_notifyEnterFunction index

  _notifyEnterFunction: (index) ->
    Crafty.e('2D, Canvas, Color, Collision')
      .attr({ x: @x, y: @y, w: 10, h: 800 })
      .color('#FF00FF')
      .onHit 'ScrollFront', ->
        unless @triggeredFront
          Crafty.trigger('EnterBlock', index)
          @triggeredFront = yes
      .onHit 'ScrollWall', ->
        @destroy()
        Crafty.trigger('LeaveBlock', index)

  enter: ->
    console.log "start scrolling into #{@name}"

  inScreen: ->
    console.log "#{@name} now full in screen!"

  leave: ->
    console.log "#{@name} just left the screen"
    @clean()

  generate: ->

  clean: ->
    #console.log "Cleaning #{@name}"
    e.destroy() for e in @createdElements
    @createdElements = []

    Crafty.unbind(b.event, b.callback) for b in @createdBindings
    @createdBindings = []

  add: (x, y, element) ->
    element.attr x: @x + x, y: @y + y
    @createdElements.push element

  bind: (event, callback) ->
    @createdBindings.push { event, callback }
    Crafty.bind(event, callback)

@Game.levelGenerator = new LevelGenerator
@Game.LevelBlock = LevelBlock
