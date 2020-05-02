const Beam = "Beam";

Crafty.c(Beam, {
  properties: {
    beamVelocity: {
      set: function(value) {
        if (this._initialBeamLength === undefined && this._beamVelocity === 0) {
          this._initialBeamLength = this._w;
        }
        this._beamVelocity = value;
        this._setBeamVelocity(this._beamVelocity);
      },
      get: function() {
        return this._beamVelocity;
      },
      configurable: true,
      enumerable: true
    },
    _beamVelocity: { value: 0, writable: true, enumerable: false }
  },
  events: {
    Freeze() {
      this.w = this._initialBeamLength;
    }
  },

  _setBeamVelocity(beamVelocity) {
    if (beamVelocity === 0) {
      this.unbind("EnterFrame", this._updateBeam);
      return;
    }
    this.uniqueBind("EnterFrame", this._updateBeam);
  },

  _updateBeam({ dt }) {
    const add = this._beamVelocity * (dt / 1000);
    this.w -= add;
  }
});

export default Beam;
