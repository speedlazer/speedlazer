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
    @_verifyActiveSynchronisations()
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

  _verifyActiveSynchronisations: ->
    for name, sync of @synchronizations
      if _.difference(@entities, sync.registered).length is 0
        sync.defer.resolve()



