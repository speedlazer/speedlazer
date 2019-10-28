const LightGlare = "LightGlare";

Crafty.c(LightGlare, {
  required: "2D, WebGL",

  init() {
    this.directGlare = Crafty.e("2D, WebGL, Glare, bigGlare, Horizon")
      .crop(0, 0, 200, 200)
      .attr({
        w: 80,
        h: 80,
        z: 91,
        alpha: 0.2
      })
      .origin("center")
      .saturationGradient(1, 1);
    this.uniqueBind("UpdateFrame", this._updateGlare);
  },

  _updateGlare() {
    //this.directGlare.attr({
    //x: x + (@w / 2) - (e.w / 2) - (dx * 2 * e.res)
    //y: @y + (@h / 2) - (e.h / 2) - (dy * 2 * e.res)
    //})
  }
});

export default LightGlare;
