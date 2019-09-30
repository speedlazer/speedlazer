const mix = (v, from, to) => [
  Math.round(from[0] * (1 - v) + to[0] * v),
  Math.round(from[1] * (1 - v) + to[1] * v),
  Math.round(from[2] * (1 - v) + to[2] * v)
];

const buildColor = (v, colors) => {
  let left;
  const parts = 1 / (colors.length - 1);
  const index = Math.floor(v / parts);
  const from = colors[index];
  const to = (left = colors[index + 1]) != null ? left : from;

  const localV = (v - index * parts) / parts;
  return mix(localV, from, to);
};

const colorToStr = color =>
  `#${color.map(value => `0${value.toString(16)}`.slice(-2)).join("")}`;

const strToColor = string => [
  parseInt(string.slice(1, 3), 16),
  parseInt(string.slice(3, 5), 16),
  parseInt(string.slice(5, 7), 16)
];

const component = "ColorFade";

Crafty.c(component, {
  colorFade(options, bottomColors, topColors) {
    const { duration, skip } = options;
    this.duration = duration;
    this._bottomColors = bottomColors.map(strToColor);
    this._topColors = topColors.map(strToColor);

    this.v = Math.max(skip || 0, 0);
    this.bind("GameLoop", this._recolor);
    return this;
  },

  remove() {
    this.trigger("ColorFadeFinished");
    this.unbind("GameLoop", this._recolor);
  },

  _recolor(fd) {
    this.v += fd.dt;
    let pos = this.v / this.duration;
    if (pos < 0) {
      pos = 0;
    }
    if (pos >= 1) {
      this.unbind("GameLoop", this._recolor);
      pos = 1;
    }

    const bcolor = buildColor(pos, this._bottomColors);
    const tcolor = buildColor(pos, this._topColors);

    this.bottomColor(bcolor);
    this.topColor(tcolor);
    this.trigger("ColorFadeUpdate", {
      topColor: colorToStr(tcolor),
      bottomColor: colorToStr(bcolor)
    });
    if (pos >= 1) {
      this.trigger("ColorFadeFinished");
    }
  }
});

export default component;
