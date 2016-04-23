Game = @Game

class Game.LazerScript
  constructor: (@level) ->

  run: (args...) ->
    @currentSequence = Math.random()
    @options = args[0] ? {}
    @startAtCheckpoint = @options.startAtCheckpoint
    @currentCheckpoint = 0

    loadingAssets = WhenJS(true)
    if @assets?
      loadingAssets = @assets(@options)(@currentSequence)

    loadingAssets.then => @initialize(args...)

  end: ->
    @currentSequence = null

  initialize: (args...) ->
    Crafty.bind 'PlayerDied', @_endScriptOnGameOver
    WhenJS(@execute(args...)(@currentSequence)).finally =>
      Crafty.unbind 'PlayerDied', @_endScriptOnGameOver

  execute: ->

  _endScriptOnGameOver: =>
    playersActive = no
    Crafty('Player ControlScheme').each ->
      playersActive = yes if @lives > 0

    unless playersActive
      @currentSequence = null

  # Inventory

  inventory: (name) ->
    @level.inventory(name)

  inventoryAdd: (type, name, options) ->
    @level.inventoryAdd(type, name, options)

_.extend(
  Game.LazerScript::
  Game.ScriptModule.Core
  Game.ScriptModule.Level
  Game.ScriptModule.Colors
  Game.ScriptTemplate.Level
)

# Could these be merged? V ^

class Game.EntityScript extends Game.LazerScript

  initialize: (args...) ->
    @boundEvents = []
    args.push {} if _.isEmpty args

    @entity = @spawn(args...)
    if _.isObject(args[0]) and args[0].identifier?
      identifier = args[0].identifier# + args[0].index
      @entity.addComponent(identifier)
    @synchronizer = @options.synchronizer ? new Game.Synchronizer
    @synchronizer.registerEntity this

    unless @entity?
      @synchronizer.unregisterEntity this
      return WhenJS({ alive: no, killedAt: (new Date), location: null })

    unless @entity.has('PlayerControlledShip')
      @entity.attr
        x: @entity.x - Crafty.viewport.x
        y: @entity.y - Crafty.viewport.y

    @entity.bind 'Destroyed', =>
      @currentSequence = null
      @synchronizer.unregisterEntity(this)
      @enemy.location.x = (@entity.x + Crafty.viewport.x)
      @enemy.location.y = (@entity.y + Crafty.viewport.y)
      @enemy.alive = no
      @enemy.killedAt = new Date

    @enemy =
      moveState: 'air'
      alive: yes
      location: {}
    #else
      #@enemy =
        #moveState: 'air'
        #alive: no
        #location: {}

    super
      .catch (e) =>
        throw e unless e.message is 'sequence mismatch'
        @alternatePath
      .finally =>
        if @enemy.alive and !@entity.has('KeepAlive')
          @entity.destroy()
      .then =>
        @enemy

  spawn: ->

_.extend(
  Game.EntityScript::
  Game.ScriptModule.Entity
)
