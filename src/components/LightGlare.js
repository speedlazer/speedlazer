import Crafty from "../crafty";

const LightGlare = "LightGlare";

Crafty.c(LightGlare, {
  required: "2D, WebGL",

  events: {
    EnterFrame() {
      const hw = Crafty.viewport.width / 2;
      const hh = Crafty.viewport.height / 2;

      const dx = this.x + this.w / 2 - hw;
      const dy = this.y + this.h / 2 - hh;
      const glareLink =
        this.glareLink || this.getElementByKey(this.glareAlphaLink);
      const alphaFactor = glareLink ? glareLink.alpha : 1.0;

      const updatePosition = (factor, item) => {
        item.attr({
          x: this.x + this.w / 2 - item.w / 2 + (-dx - dx) * factor,
          y: this.y + this.h / 2 - item.h / 2 + (-dy - dy) * factor,
          alpha: item.baseAlpha * alphaFactor
        });
      };

      updatePosition(1.1, this.bigGlare);
      updatePosition(0.9, this.blueGlare);
      updatePosition(0.8, this.redGlare);
    }
  },

  init() {
    this.bigGlare = Crafty.e("2D, WebGL, Glare, bigGlare, Horizon")
      .crop(0, 0, 200, 200)
      .attr({
        w: 200,
        h: 200,
        z: 91,
        baseAlpha: 0.3,
        alpha: 0
      })
      .origin("center")
      .saturationGradient(0.1, 0.1);

    this.blueGlare = Crafty.e("2D, WebGL, Glare, bigGlare, Horizon")
      .crop(0, 0, 200, 200)
      .attr({
        w: 80,
        h: 80,
        z: 91,
        baseAlpha: 0.5,
        alpha: 0
      })
      .origin("center")
      .saturationGradient(1, 1);

    this.redGlare = Crafty.e("2D, WebGL, Glare, bigGlare, ColorEffects")
      .crop(0, 0, 200, 200)
      .attr({
        w: 20,
        h: 20,
        z: 91,
        baseAlpha: 0.7,
        alpha: 0
      })
      .colorOverride("#fd6565")
      .origin("center");
  }
});

export default LightGlare;
