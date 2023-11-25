import { togglePause } from "../../lib/core/pauseToggle";
import Listener from "../generic/Listener";
import ControlScheme from "../player/ControlScheme";
import Crafty from "../../crafty";

const KeyboardControls = "KeyboardControls";

Crafty.c(KeyboardControls, {
  init() {
    this.requires(Listener);
    this.bind("RemoveComponent", function(componentName) {
      if (componentName === ControlScheme) {
        this.removeComponent(KeyboardControls);
      }
    });
  },

  remove() {
    this.unbind("KeyDown", this._keyHandling);
  },

  setupControls(player) {
    player
      .addComponent(KeyboardControls)
      .controls(this.controlMap)
      .addComponent(ControlScheme);
  },

  controls(controlMap) {
    this.controlMap = controlMap;
    this.bind("KeyDown", this._keyHandling);
    return this;
  },

  _keyHandling(e) {
    if (e.key === this.controlMap.fire) {
      this.trigger("Fire", e);
    }
    if (e.key === this.controlMap.up) {
      this.trigger("Up", e);
    }
    if (e.key === this.controlMap.down) {
      this.trigger("Down", e);
    }
    if (e.key === this.controlMap.left) {
      this.trigger("Left", e);
    }
    if (e.key === this.controlMap.right) {
      this.trigger("Right", e);
    }
  },

  assignControls(ship) {
    const { controlMap } = this;

    const directions = {
      up: -90,
      down: 90,
      left: 180,
      right: 0
    };

    // Remap back to key names to prevent sliding effect
    const movementMap = Object.entries(directions).reduce(
      (acc, [direction, value]) => {
        const keyValue = controlMap[direction];
        const key = Object.entries(Crafty.keys).find(
          ([, value]) => value === keyValue
        );
        return { ...acc, [key[0]]: value };
      },
      {}
    );

    ship
      .addComponent("Multiway, Keyboard")
      .multiway({ y: 500, x: 500 }, movementMap, { clamp: true })
      .bind("GamePause", function(paused) {
        if (paused) {
          this.disabledBeforePause = this.disableControls;
          this.disableControl();
        } else {
          if (!this.disabledBeforePause) {
            this.enableControl();
          }
        }
      });

    this.listenTo(ship, "KeyDown", function(e) {
      if (e.key === controlMap.fire) {
        ship.shoot(true);
      }
      if (e.key === controlMap.switchWeapon) {
        ship.switchWeapon(true);
      }
      if (e.key === controlMap.super) {
        ship.superWeapon(true);
      }
      if (e.key === controlMap.pause) {
        togglePause();
      }
    });

    this.listenTo(ship, "KeyUp", function(e) {
      if (e.key === controlMap.fire) {
        ship.shoot(false);
      }
      if (e.key === controlMap.switchWeapon) {
        ship.switchWeapon(false);
      }
      if (e.key === controlMap.super) {
        ship.superWeapon(false);
      }
    });
  }
});

export default KeyboardControls;
