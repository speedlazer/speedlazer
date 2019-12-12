import Listener from "src/components/generic/Listener";
import ControlScheme from "src/components/player/ControlScheme";
import ShipControls from "src/components/player/ShipControls";
import { createEntity } from "src/components/EntityDefinition";

Crafty.c("ShipSpawnable", {
  init() {
    this.requires(Listener);
    this.bind("Activated", this.spawnShip);
  },

  remove() {
    this.unbind("Activated", this.spawnShip);
  },

  spawnPosition(spawnPosition) {
    this.spawnPosition = spawnPosition;
    if (this.spawnPosition == null) {
      this.spawnPosition = () => ({
        x: this.x,
        y: this.y
      });
    }
    return this;
  },

  spawnShip(stats = {}) {
    if (!this.has(ControlScheme)) {
      return;
    }
    if (!(this.lives > 0)) {
      return;
    }

    let pos = this.spawnPosition();
    if (pos.x < 10) {
      pos.x = 10;
    }
    if (this.ship != null) {
      pos = {
        x: this.ship.x,
        y: this.ship.y
      };
      this.ship.destroy();
      this.ship = null;
    }

    this.ship = createEntity(this.shipType, { location: pos });
    this.ship.addComponent(ShipControls);

    if (this.has(ControlScheme)) {
      this.assignControls(this.ship);
    }

    this.trigger("ShipSpawned", this.ship);
    Crafty.trigger("ShipSpawned", this.ship);

    // We start it after the spawned event, so that listeners can
    // reposition it before
    return this.ship;
  }
});
