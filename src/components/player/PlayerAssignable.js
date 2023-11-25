import Crafty from "../../crafty";
import ControlScheme from "./ControlScheme";
import Player from "./Player";

const PlayerAssignable = "PlayerAssignable";

Crafty.c(PlayerAssignable, {
  init() {
    this._attachControllerAssignTrigger();
    this.preferredPlayer = null;
  },

  _assignControls() {
    const player = this._preferredPlayer() || this._firstUnassignedPlayer();

    if (player == null) {
      // Try again next time
      this._attachControllerAssignTrigger();
      return;
    }
    this.preferredPlayer = player.getId();

    this.setupControls(player);
    player.one("Deactivated", () => {
      this._attachControllerAssignTrigger();
    });
  },

  _attachControllerAssignTrigger() {
    this.one("Fire", this._assignControls);
  },

  _preferredPlayer() {
    if (this.preferredPlayer !== null) {
      const player = Crafty(this.preferredPlayer);
      if (!player.has(ControlScheme)) {
        return player;
      }
    }
  },

  _firstUnassignedPlayer() {
    const players = Crafty(Player);
    return Array.from(players)
      .map(playerId => Crafty(playerId))
      .find(player => !player.has(ControlScheme));
  }
});

export default PlayerAssignable;
