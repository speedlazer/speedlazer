const ShipControls = "ShipControls";

Crafty.c(ShipControls, {
  init() {
    this.bind("NewDirection", direction => {
      if (this.disableControls) return;
      if (
        (direction.x === -1 && !this.xFlipped) ||
        (direction.x === 1 && this.xFlipped)
      ) {
        if (this.appliedEntityState === "dead") return;
        if (this.appliedEntityState !== "reverse") {
          this.showState("reverse");
        }
      } else {
        if (this.appliedEntityState !== "flying") {
          this.showState("flying");
        }
      }
    });
  },

  buttonPressed(name, onOff) {
    if (this.disableControls) return;
    if (this.appliedEntityState === "dead") return;

    if (name === "fire") {
      onOff && this.buttonPressed("heavy", false);
      onOff ? this.showState("shooting") : this.showState("noShooting");
    }

    if (name === "heavy") {
      if (!this.hasLaser) return;
      onOff && this.buttonPressed("fire", false);
      onOff
        ? this.showState("laserShooting")
        : this.showState("noLaserShooting");
    }
  }
});

export default ShipControls;
