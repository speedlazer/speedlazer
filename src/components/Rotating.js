import Crafty from "../crafty";

const component = "Rotating";

Crafty.c(component, {
  required: "2D",
  events: {
    GameLoop({ dt }) {
      // vr = velocity of rotation
      if (this.vr !== 0) {
        this.rotation = (this.rotation + (this.vr * dt) / 1000) % 360;
      }
    }
  }
});

export default component;
