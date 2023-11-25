import Crafty from "../crafty";
import { Stretchable } from "./utils/Stretchable";

const Beam = "Beam";

Crafty.c(Beam, {
  required: Stretchable,
  properties: {
    beamVelocity: {
      set: function(value) {
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
      this._beamVelocity = 0;
      this.beamBlocked = false;
    }
  },

  _setBeamVelocity(beamVelocity) {
    if (beamVelocity === 0) {
      this.unbind("EnterFrame", this._updateBeam);
      return;
    }
    this.beamLength = this.sw;
    this.uniqueBind("EnterFrame", this._updateBeam);
  },

  _updateBeam({ dt }) {
    const add = this._beamVelocity * (dt / 1000);
    if (!this.beamBlocked) {
      this.sw += add;
    }
    this.beamLength += add;
  }
});

export default Beam;
