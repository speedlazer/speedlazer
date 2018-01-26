const MOVE_X = -32;
const MOVE_Y = 16;

Crafty.c("CarrierHatch", {
  init() {
    this.requires("2D, WebGL, aircraftCarrierOpenHatch");
    this.attr({ z: -10 });
    this.crop(0, 2, 5 * 32, 32);

    this.lid = Crafty.e("2D, WebGL, aircraftCarrierHatchLid, Tween, Delta2D");
    this.lid.crop(0, 2, 5 * 32, 32);
    this.lid.attr({
      z: -9,
      x: this.x,
      y: this.y
    });
    this.attach(this.lid);

    this.dust = Crafty.e("2D, WebGL, Explode, ColorEffects");
    this.dust.colorOverride("#808080");
    this.dust.attr({
      w: 150,
      alpha: 0,
      h: 30,
      x: this.x,
      y: this.y
    });
    this.attach(this.dust);
  },

  open() {
    this.dust.alpha = 0.2;
    this.lid.attr({ dy: 0, dx: 0 });
    this.lid.tween(
      {
        dx: MOVE_X,
        dy: MOVE_Y
      },
      600,
      "easeInOutQuad"
    );
    this.dust.one("TweenEnd", () => {
      this.dust.alpha = 0;
    });
    this.dust.playExplode(800);
  },

  close() {
    this.lid.attr({
      dx: MOVE_X,
      dy: MOVE_Y
    });
    this.lid.tween(
      {
        dy: 0,
        dx: 0
      },
      600,
      "easeInOutQuad"
    );
    this.lid.one("TweenEnd", () => {
      this.dust.alpha = 0.2;
      this.dust.one("AnimationEnd", () => {
        this.dust.alpha = 0;
      });
      this.dust.playExplode(800);
    });
  }
});
