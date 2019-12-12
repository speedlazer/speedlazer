const ShipControls = "ShipControls";

Crafty.c(ShipControls, {
  controlPrimary(onOff) {
    onOff ? this.showState("shooting") : this.showState("noShooting");
  },

  controlSecondary(onOff) {},

  controlSecondary(onOff) {},

  controlBlock(onOff) {}
});

export default ShipControls;
