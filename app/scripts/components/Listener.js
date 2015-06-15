'use strict';

Crafty.c('Listener', {
  init: function () {
    this.listeners = []
  },
  remove: function () {
    for (var i; i < this.listeners.length; i++) {
      var listener = this.listeners[i];
      listener.object.unbind(listener.event, listener.callback);
    }
  },
  listenTo: function(object, event, callback, context) {
    if (context === undefined) {
      context = this;
    }

    var realCallback = function () {
      callback.apply(context, arguments);
    }

    this.listeners.push({
      object: object,
      event: event,
      callback: realCallback
    });

    object.bind(event, realCallback);
  }
});
