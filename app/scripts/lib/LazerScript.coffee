Game = @Game

class Game.LazerScript
  constructor: (@level) ->

  run: (args...) ->
    @currentSequence = Math.random()
    WhenJS(@execute(args...)(@currentSequence))

  execute: ->

  # Inventory
  # TODO: Decide how we handle inventory thoughout game

  inventory: (type, name) ->
    @invItems ||= {}
    @invItems[type] ||= {}
    @invItems[type][name || 'default']

  inventoryAdd: (type, name, constructor) ->
    @invItems ||= {}
    @invItems[type] ||= {}
    @invItems[type][name] = constructor

_.extend Game.LazerScript::, Game.ScriptModule.Core, Game.ScriptModule.Level

# Could these be merged? V ^

class Game.EntityScript extends Game.LazerScript

  run: (args...) ->
    @boundEvents = []
    @entity = @spawn(args...)

    if @entity?
      @entity.attr
        x: @entity.x - Crafty.viewport.x
        y: @entity.y - Crafty.viewport.y

      @entity.bind 'Destroyed', =>
        @currentSequence = null
        @enemy.location.x = (@entity.x + Crafty.viewport.x)
        @enemy.location.y = (@entity.y + Crafty.viewport.y)
        @enemy.alive = no
        @enemy.killedAt = new Date

      @enemy =
        moveState: 'air'
        alive: yes
        location: {}
    else
      @enemy =
        moveState: 'air'
        alive: no
        location: {}

    super
      .catch =>
        @alternatePath
      .finally =>
        if @enemy.alive and @entity.has('Enemy')
          @entity.destroy()
      .then =>
        @enemy

  spawn: ->

_.extend Game.EntityScript::, Game.ScriptModule.Core, Game.ScriptModule.Entity
