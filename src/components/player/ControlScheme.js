import Crafty from "../../crafty";

const ControlScheme = "ControlScheme";

Crafty.c(ControlScheme, {
  init() {
    if (!this.has("Cheats")) {
      this.addComponent("Cheats");
    }
    this.trigger("Activated");
    Crafty.trigger("PlayerActivated");
  },

  remove() {
    if (this.has("Cheats")) {
      this.removeComponent("Cheats");
    }
    this.trigger("Deactivated");
    Crafty.trigger("PlayerDeactivated");
  }
});

export default ControlScheme;
