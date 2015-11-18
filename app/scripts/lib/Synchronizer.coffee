Game = @Game

class Game.Synchronizer
  constructor: ->
    @entities = []
    @synchronizations = {}

  registerEntity: (entity) ->
    @entities.push entity if entity not in @entities
    entity

  unregisterEntity: (entity) ->
    index = _.indexOf(@entities, entity)
    @entities.splice(index, 1) if index >= 0
    entity

  synchronizeOn: (name, entity) ->
    synchronization = @synchronizations[name]
    unless synchronization
      synchronization =
        defer: WhenJS.defer()
        registered: []
      @synchronizations[name] = synchronization

    synchronization.registered.push entity if entity not in synchronization.registered
    if _.difference(@entities, synchronization.registered).length is 0
      synchronization.defer.resolve()

    synchronization.defer.promise

