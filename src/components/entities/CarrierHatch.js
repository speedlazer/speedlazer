const MOVE_X = -32;
const MOVE_Y = 16;

Crafty.c("CarrierHatch", {
  init() {
    this.requires("2D, WebGL, aircraftCarrierOpenHatch");
    this.attr({ z: -10 });
    this.crop(0, 2, 5 * 32, 32);

    this.wire = Crafty.e("2D, WebGL, aircraftCarrierWires");
    this.wire.attr({
      z: -14,
      x: this.x + 80,
      y: this.y - 20
    });
    this.attach(this.wire);

    this.lid = Crafty.e(
      "2D, WebGL, aircraftCarrierHatchLid, Hideable, Tween, Delta2D"
    );
    this.lid.crop(0, 2, 5 * 32, 32);

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

  hitFlashParts() {
    return [this.lid, this.wire];
  },

  hatch() {
    this.lid.attr({
      z: -4,
      x: this.x,
      y: this.y
    });

    if (this.floorOffset) {
      this.floor = Crafty.e(
        "2D, WebGL, aircraftCarrierHatchLid, Hideable, Tween, Delta2D"
      );
      this.floor.crop(0, 2, 5 * 32, 32);

      this.floor.attr({
        z: -5,
        x: this.x - 4,
        y: this.y + 3,
        hideAt: this.y + 30
      });
      this.attach(this.floor);
    }

    return this;
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

    if (this.floor) {
      this.rise();
    }
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
  },

  rise() {
    this.floor.attr({ dy: this.floorOffset });
    this.floor.tween(
      {
        dy: 0
      },
      1500,
      "easeInOutQuad"
    );
  },
});
