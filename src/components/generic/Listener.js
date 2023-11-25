import Crafty from "../../crafty";

const Listener = "Listener";

Crafty.c(Listener, {
  init() {
    this.listeners = [];
  },

  remove() {
    this.listeners.forEach(({ object, event, callback }) => {
      object.unbind(event, callback);
    });
    this.listeners = [];
  },

  listenTo(object, event, callback, context) {
    if (context == null) {
      context = this;
    }

    const realCallback = (...args) => {
      callback.apply(context, args);
    };

    this.listeners.push({
      object,
      event,
      callback: realCallback
    });

    object.uniqueBind(event, realCallback);
  }
});

export default Listener;
