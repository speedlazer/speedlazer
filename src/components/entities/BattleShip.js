import battleShipComposition from "src/components/entities/BattleShip.composition.json";
import firstCabinComposition from "src/components/entities/FirstCabin.composition.json";
import secondCabinComposition from "src/components/entities/SecondCabin.composition.json";

Crafty.c("BattleShip", {
  required:
    "2D, WebGL, Tween, Choreography, ShipSolid, Collision," +
    "Hideable, Flipable, Scalable, SunBlock, WaterSplashes," +
    "Sprite, Composable",

  init() {
    const width = 40;
    this.attr({
      w: 32 * width,
      h: 32 * 7,
      z: -20,
      waterRadius: 10,
      minSplashDuration: 600,
      defaultWaterCooldown: 400,
      waterSplashSpeed: 700,
      minOffset: -20
    });
    this.compose(battleShipComposition);

    this.hatch = Crafty.e("CarrierHatch, ShipHatch1").attr({
      x: this.x + 10 * 32,
      y: this.y + 29,
      floorOffset: 75
    });
    this.attach(this.hatch);

    this.hatch2 = Crafty.e("CarrierHatch, ShipHatch2").attr({
      x: this.x + 16 * 32,
      y: this.y + 29,
      floorOffset: 75
    });
    this.attach(this.hatch2);

    this.hatch3 = Crafty.e("CarrierHatch, ShipHatch3").attr({
      x: this.x + 22 * 32,
      y: this.y + 29,
      floorOffset: 75
    });
    this.attach(this.hatch3);

    this.hideBelow(540);

    this.collision([20, 60, 32 * width, 60, 32 * width, 188, 20, 188]);
    this.bind("Revealing", () => this.hideBelow(540));
    this.bind("Hiding", () => this.hideBelow(540));
  },

  ship() {
    this.hatch.hatch("HatchFloor1");
    this.hatch2.hatch("HatchFloor2");
    this.hatch3.hatch("HatchFloor3");
    return this;
  },

  open(hatch) {
    if (hatch.includes(0)) {
      this.hatch.open();
    }
    if (hatch.includes(1)) {
      this.hatch2.open();
    }
    if (hatch.includes(2)) {
      this.hatch3.open();
    }
  },

  close(hatch) {
    if (hatch.includes(0)) {
      this.hatch.close();
    }
    if (hatch.includes(1)) {
      this.hatch2.close();
    }
    if (hatch.includes(2)) {
      this.hatch3.close();
    }
  },

  execute(action, index = "all") {
    switch (action) {
      case "open":
        if (index === "all") {
          return this.open([0, 1, 2]);
        } else {
          return this.open([index]);
        }
      case "close":
        if (index === "all") {
          return this.close([0, 1, 2]);
        } else {
          return this.close([index]);
        }
      case "activateCannon":
        return Crafty(`Turret${index + 1}`).trigger("Activate");
      case "deactivateCannon":
        return Crafty(`Turret${index + 1}`).trigger("Deactivate");
    }
  }
});

Crafty.c("FirstShipCabin", {
  required: "Enemy, Composable",

  init() {
    this.attr({
      w: 10,
      h: 10,
      z: -8,
      health: 2000
    });
    this.hitBox = Crafty.e("2D, WebGL, Collision, SunBlock");
    this.hitBox.attr({
      x: this.x + 10,
      y: this.y - 100 - 110,
      w: 200,
      h: 130
    });
    this.compose(firstCabinComposition);

    this.attach(this.hitBox);
    this.bind("HitFlash", this.applyCabinHitFlash);
  },

  shipCabin() {
    this.hitBox.onHit(
      "Bullet",
      e => this.trigger("HitOn", e),
      c => this.trigger("HitOff", c)
    );
    this.hitBox.onHit(
      "Explosion",
      e => this.trigger("HitOn", e),
      c => this.trigger("HitOff", c)
    );

    this.hitParts = [];

    this.enemy({
      pointsLocation: {
        x: 3 * 32,
        y: -(5 * 32)
      }
    });
    return this;
  },

  linkHatch(linkedHatch) {
    this.hitParts = this.hitParts.concat(linkedHatch.hitFlashParts());
    return this;
  },

  applyCabinHitFlash(onOff) {
    this.hitParts.forEach(function(part) {
      if (onOff) {
        return part.attr({ hitFlash: { _red: 255, _green: 255, _blue: 255 } });
      } else {
        return part.attr({ hitFlash: false });
      }
    });
  },

  updatedHealth() {
    if (this.health === 1) {
      this.antenna.alpha = 0;
      this.radar.alpha = 0;
      this._replaceByDestroyed();
    }
  }
});

Crafty.c("SecondShipCabin", {
  required: "Enemy, Composable",

  init() {
    this.attr({
      w: 10,
      h: 10,
      z: -8,
      health: 4000
    });
    this.hitBox = Crafty.e("2D, WebGL, Collision");
    this.hitBox.attr({
      x: this.x + 10,
      y: this.y - 100 - 110,
      w: 200,
      h: 130
    });
    this.compose(secondCabinComposition);

    this.attach(this.hitBox);
    this.bind("HitFlash", this.applyCabinHitFlash);
  },

  shipCabin() {
    /*
    const doorType = open ? "aircraftCarrierOpened" : "aircraftCarrierClosed";
    const doorX = this.x + (open ? 3.5 * 32 : 4 * 32);
    this.door = Crafty.e(`2D, WebGL, ${doorType}`).attr({
      x: doorX,
      y: this.y - 5 * 32 - 4,
      z: -8
    });
    this.attach(this.door);
    */

    this.hitBox.onHit(
      "Bullet",
      e => this.trigger("HitOn", e),
      c => this.trigger("HitOff", c)
    );
    this.hitBox.onHit(
      "Explosion",
      e => this.trigger("HitOn", e),
      c => this.trigger("HitOff", c)
    );

    this.hitParts = [];
    /*
    this.hitParts = [
      ...this.cabinParts,
      this.antenna1,
      this.antenna2,
      this.door
    ];
    */

    this.enemy({
      pointsLocation: {
        x: 3 * 32,
        y: -(5 * 32)
      }
    });
    return this;
  },

  linkHatch(linkedHatch) {
    this.hitParts = this.hitParts.concat(linkedHatch.hitFlashParts());
    return this;
  },

  applyCabinHitFlash(onOff) {
    return this.hitParts.forEach(function(part) {
      if (onOff) {
        return part.attr({ hitFlash: { _red: 255, _green: 255, _blue: 255 } });
      } else {
        return part.attr({ hitFlash: false });
      }
    });
  },

  updatedHealth() {
    if (this.health === 1) {
      this.antenna1.alpha = 0;
      this.antenna2.alpha = 0;
    }
  }
});
