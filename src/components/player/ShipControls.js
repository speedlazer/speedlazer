const ShipControls = "ShipControls";

Crafty.c(ShipControls, {
  init() {
    this.bind("NewDirection", direction => {
      if (direction.x === -1) {
        this.showState("reverse");
      } else {
        this.showState("flying");
      }
    });
  },

  controlPrimary(onOff) {
    onOff ? this.showState("shooting") : this.showState("noShooting");
  },

  controlSecondary() {},
  controlSwitch() {},
  controlBlock() {}
});

export default ShipControls;
