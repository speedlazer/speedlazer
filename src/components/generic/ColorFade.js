export const mix = (v, from, to) => ({
  _red: Math.round(from._red * (1 - v) + to._red * v),
  _green: Math.round(from._green * (1 - v) + to._green * v),
  _blue: Math.round(from._blue * (1 - v) + to._blue * v),
  _strength: from._strength * (1 - v) + to._strength * v
});

export const strToColor = ([string, alpha]) => ({
  _red: parseInt(string.slice(1, 3), 16),
  _green: parseInt(string.slice(3, 5), 16),
  _blue: parseInt(string.slice(5, 7), 16),
  _strength: alpha
});

const ColorFade = "ColorFade";

Crafty.c(ColorFade, {
  colorFade(topColor, bottomColor, duration, easing) {
    if (duration === 0) {
      this._nextTopColor = strToColor(topColor);
      this._nextBottomColor = strToColor(bottomColor);
      this._topColor = this._nextTopColor;
      this._bottomColor = this._nextBottomColor;
      this.trigger("Invalidate");
      return;
    }

    this._nextTopColor = strToColor(topColor);
    this._nextBottomColor = strToColor(bottomColor);
    this._startTopColor = this.topColor();
    this._startBottomColor = this.bottomColor();
    this.colorFadeTimer = new Crafty.easing(duration, easing);

    if (!this.fadingColors) {
      this.fadingColors = true;
      this.bind("EnterFrame", this.updateColorFade);
    }
    return this;
  },

  stopColorFade() {
    if (this.fadingColors) {
      this.unbind("EnterFrame", this.updateColorFade);
      this.fadingColors = false;
      this.trigger("FadeAborted");
    }
  },

  updateColorFade({ dt }) {
    this.colorFadeTimer.tick(dt);
    const value = this.colorFadeTimer.value();
    this._topColor = mix(value, this._startTopColor, this._nextTopColor);
    this._bottomColor = mix(
      value,
      this._startBottomColor,
      this._nextBottomColor
    );
    this.trigger("Invalidate");

    if (value >= 1.0) {
      this.unbind("EnterFrame", this.updateAcceleration);
      this.fadingColors = false;
      this.trigger("FadeCompleted");
    }
  }
});

export default ColorFade;
