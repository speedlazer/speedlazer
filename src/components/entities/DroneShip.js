import droneShipComposition from "src/components/entities/DroneShip.composition.json";

Crafty.c("DroneShip", {
  init() {
    this.requires(
      "2D, WebGL, Tween, Choreography, ShipSolid, Collision," +
        "Hideable, Flipable, Scalable, SunBlock, WaterSplashes, " +
        "Composable"
    );
    this.attr({
      w: 32 * 20,
      h: 32 * 5,
      z: 6,
      waterRadius: 10,
      minSplashDuration: 600,
      defaultWaterCooldown: 400,
      waterSplashSpeed: 700,
      minOffset: -20
    });
    this.collision([20, 50, 19 * 32, 50, 19 * 32, 128, 20, 128]);
    this.compose(droneShipComposition);
    this.hatch = Crafty.e("CarrierHatch, ShipHatch1").attr({
      x: this.x + 3 * 32,
      y: this.y + 29
    });
    this.attach(this.hatch);
    this.hideBelow(560);

    return this.attach(
      Crafty.e("2D, TurretPlace").attr({
        x: this.x + 370,
        y: this.y + 74,
        z: 15,
        w: 15,
        h: 2
      })
    );
  },

  open() {
    return this.hatch.open();
  },

  close() {
    return this.hatch.close();
  },

  execute(action) {
    switch (action) {
      case "open":
        return this.open();
      case "close":
        return this.close();
    }
  }
});
