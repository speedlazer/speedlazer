Crafty.c 'Listener',
  init: ->
    @listeners = []

  remove: ->
    object.unbind(event, callback) for { object, event, callback } in @listeners

  listenTo: (object, event, callback, context) ->
    context = this unless context?

    realCallback = ->
      callback.apply(context, arguments)

    @listeners.push
      object: object
      event: event
      callback: realCallback

    object.bind(event, realCallback)
