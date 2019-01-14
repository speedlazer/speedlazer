import battleShipComposition from "src/data/compositions/BattleShip.composition.json";

Crafty.c("OldBattleShip", {
  required:
    "2D, WebGL, Tween, Choreography, ShipSolid," +
    "Hideable, Flipable, Scalable, SunBlock, WaterSplashes," +
    "Sprite, Composable",

  init() {
    this.attr({
      z: -20,
      waterRadius: 10,
      minSplashDuration: 600,
      defaultWaterCooldown: 400,
      waterSplashSpeed: 700,
      minOffset: -20
    });
    this.compose(battleShipComposition["battkeship.deck"]);

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
    this.compose(battleShipComposition.firstCabin);
    this.bind("HitFlash", this.applyCabinHitFlash);
  },

  shipCabin() {
    this.onHit(
      "Bullet",
      e => this.trigger("HitOn", e),
      c => this.trigger("HitOff", c)
    );
    this.onHit(
      "Explosion",
      e => this.trigger("HitOn", e),
      c => this.trigger("HitOff", c)
    );

    this.enemy({
      pointsLocation: {
        x: 3 * 32,
        y: -(5 * 32)
      }
    });
    return this;
  },

  applyCabinHitFlash(onOff) {
    this.forEachPart(part => {
      if (onOff) {
        part.attr({ hitFlash: { _red: 255, _green: 255, _blue: 255 } });
      } else {
        part.attr({ hitFlash: false });
      }
    });
  }
});

Crafty.c("SecondShipCabin", {
  required: "Enemy, Composable",

  init() {
    this.attr({
      z: -8,
      health: 4000
    });
  },

  shipCabin() {
    this.bind("HitFlash", this.applyCabinHitFlash);
    this.onHit(
      "Bullet",
      e => this.trigger("HitOn", e),
      c => this.trigger("HitOff", c)
    );
    this.onHit(
      "Explosion",
      e => this.trigger("HitOn", e),
      c => this.trigger("HitOff", c)
    );

    this.enemy({
      pointsLocation: {
        x: 3 * 32,
        y: -(5 * 32)
      }
    });
    return this;
  },

  displayState(openDoor) {
    this.attr({ z: -8 });
    this.compose(
      openDoor
        ? battleShipComposition.secondCabinOpen
        : battleShipComposition.secondCabin
    );
    return this;
  },

  applyCabinHitFlash(onOff) {
    this.forEachPart(part => {
      if (onOff) {
        part.attr({ hitFlash: { _red: 255, _green: 255, _blue: 255 } });
      } else {
        part.attr({ hitFlash: false });
      }
    });
  }
});
