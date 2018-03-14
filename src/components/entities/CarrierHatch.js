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
      "2D, WebGL, aircraftCarrierHatchLid, Hideable, TweenPromise, Delta2D"
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

  hatch(label) {
    this.lid.attr({
      z: -4,
      x: this.x,
      y: this.y
    });

    if (this.floorOffset) {
      this.floor = Crafty.e(
        "2D, WebGL, aircraftCarrierHatchLid, Hideable, TweenPromise, Delta2D"
      );
      this.floor.addComponent(label);
      this.floor.crop(0, 2, 5 * 32, 32);

      this.floor.attr({
        z: -5,
        x: this.x - 4,
        y: this.y + 3,
        dy: this.floorOffset
      });
      this.floor.hideBelow(this.y + 30);
      this.attach(this.floor);
    }

    return this;
  },

  async open() {
    this.dust.alpha = 0.2;
    this.lid.attr({ dy: 0, dx: 0 });
    this.dust.one("TweenEnd", () => {
      this.dust.alpha = 0;
    });
    this.dust.playExplode(800);
    await this.lid.tweenPromise(
      {
        dx: MOVE_X,
        dy: MOVE_Y
      },
      600,
      "easeInOutQuad"
    );
    if (this.floor) {
      await this.rise();
    }
  },

  async close() {
    if (this.floor) {
      await this.lower();
    }
    this.lid.attr({
      dx: MOVE_X,
      dy: MOVE_Y
    });
    await this.lid.tweenPromise(
      {
        dy: 0,
        dx: 0
      },
      600,
      "easeInOutQuad"
    );
    this.dust.alpha = 0.2;
    this.dust.one("AnimationEnd", () => {
      this.dust.alpha = 0;
    });
    this.dust.playExplode(800);
  },

  async rise() {
    this.floor.attr({ dy: this.floorOffset });
    await this.floor.tweenPromise(
      {
        dy: 0
      },
      500,
      "easeInOutQuad"
    );
  },

  async lower() {
    this.floor.attr({ dy: 0 });
    await this.floor.tweenPromise(
      {
        dy: this.floorOffset
      },
      500,
      "easeInOutQuad"
    );
  }
});
