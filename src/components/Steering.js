const Steering = "Steering";

Crafty.c(Steering, {
  properties: {
    steering: {
      set: function(value) {
        if (this._steering !== value) {
          this._steering = value;
          if (value === 0) {
            this.unbind("EnterFrame", this._updateSteering);
          } else {
            this._updateSteering({ dt: 1 });
            this.uniqueBind("EnterFrame", this._updateSteering);
          }
        }
      },
      get: function() {
        return this._steering;
      },
      configurable: true,
      enumerable: true
    },
    _steering: { value: 0, writable: true, enumerable: false }
  },

  _updateSteering({ dt }) {
    console.log("update steering", this.target, this._steering);
  }
});

export default Steering;
