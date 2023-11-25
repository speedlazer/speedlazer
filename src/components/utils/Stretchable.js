import Crafty from "../../crafty";
import { rotX } from "../../lib/rotation";

export const Stretchable = "Stretchable";
export const Stretcher = "Stretcher";

Crafty.c(Stretchable, {
  properties: {
    sw: {
      set(v) {
        if (v === this._w) return;
        this._stretch(v, this._h, "w");
      },
      get() {
        return this._w;
      },
      configurable: true,
      enumerable: true
    },
    sh: {
      set(v) {
        if (v === this._h) return;
        this._stretch(this._w, v, "h");
      },
      get() {
        return this._h;
      },
      configurable: true,
      enumerable: true
    }
  },

  _stretch(_w, _h, axis) {
    this.trigger("Stretch", { dw: _w - this._w, dh: _h - this._h });
    const resizeData = {
      axis: axis,
      amount: axis === "w" ? _w - this._w : _h - this._h
    };

    this._w = _w;
    this._h = _h;
    this._calculateMBR();

    this.trigger("Resize", resizeData);
    this.trigger("Invalidate");
  }
});

Crafty.c(Stretcher, {
  init() {
    this._handleStretch = this._handleStretch.bind(this);
  },
  _handleStretch(s) {
    const xShift = this.stretch[3] * s.dw;
    const widthShift = this.stretch[1] * s.dw - xShift;
    const yShift = this.stretch[0] * s.dh;
    const heightShift = this.stretch[2] * s.dh - yShift;
    this._w += widthShift;
    this._h += heightShift;
    const [xRotShift, yRotShift] = rotX(this, xShift);

    this._x += xRotShift;
    this._y += yRotShift;
    this.trigger("Invalidate");
  },
  activateStretch(source) {
    source.uniqueBind("Stretch", this._handleStretch);
  }
});

export default Stretchable;
