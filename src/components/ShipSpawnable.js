import Listener from "./generic/Listener";
import ControlScheme from "./player/ControlScheme";
import ShipControls from "./player/ShipControls";
import ShipCollision from "./player/ShipCollision";
import { createEntity } from "./EntityDefinition";
import Crafty from "../crafty";

Crafty.c("ShipSpawnable", {
  required: Listener,
  events: {
    Activated: "spawnShip"
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

  spawnShip({ existing = false }) {
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

    this.ship = existing
      ? Crafty(this.shipType).get(0) ||
        createEntity(this.shipType, { location: pos })
      : createEntity(this.shipType, { location: pos });
    this.ship.addComponent(ShipControls, ShipCollision);
    this.ship.allowDamage({ health: 50 });

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
