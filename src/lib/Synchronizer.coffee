difference = require('lodash/difference')

class Game.Synchronizer
  constructor: ->
    @entities = []
    @synchronizations = {}
    @onceTriggers = []

  registerEntity: (entity) ->
    @entities.push entity if entity not in @entities
    entity

  unregisterEntity: (entity) ->
    index = @entities.indexOf(entity)
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
    if difference(@entities, synchronization.registered).length is 0
      synchronization.defer.resolve()

    synchronization.defer.promise

  allowOnce: (name) ->
    if @onceTriggers.indexOf(name) is -1
      @onceTriggers.push name
      yes
    else
      no

  _verifyActiveSynchronisations: ->
    for name, sync of @synchronizations
      if difference(@entities, sync.registered).length is 0
        sync.defer.resolve()



