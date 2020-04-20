const ShipControls = "ShipControls";

Crafty.c(ShipControls, {
  init() {
    this.bind("NewDirection", direction => {
      if (this.disableControls) return;
      if (
        (direction.x === -1 && !this.xFlipped) ||
        (direction.x === 1 && this.xFlipped)
      ) {
        this.showState("reverse");
      } else {
        this.showState("flying");
      }
    });
  },

  controlPrimary(onOff) {
    if (this.disableControls) return;
    onOff ? this.showState("shooting") : this.showState("noShooting");
  },

  controlSecondary() {},
  controlSwitch() {},
  controlBlock() {}
});

export default ShipControls;
