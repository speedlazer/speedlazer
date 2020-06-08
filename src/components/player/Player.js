import ControlScheme from "src/components/player/ControlScheme";

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
