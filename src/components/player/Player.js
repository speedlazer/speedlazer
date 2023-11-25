import Crafty from "../../crafty";
import ControlScheme from "./ControlScheme";

const Player = "Player";

Crafty.c(Player, {
  init() {
    this.reset();
  },

  reset() {
    if (this.has(ControlScheme)) {
      this.removeComponent(ControlScheme);
    }
  }
});

export default Player;
