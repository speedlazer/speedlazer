import { togglePause } from "src/lib/core/pauseToggle";
import Listener from "src/components/generic/Listener";
import ControlScheme from "src/components/player/ControlScheme";

const AnalogKeyboardControls = "AnalogKeyboardControls";

Crafty.c(AnalogKeyboardControls, {
  init() {
    this.requires(Listener);
    this.bind("RemoveComponent", componentName => {
      if (componentName === ControlScheme) {
        this.removeComponent(AnalogKeyboardControls);
      }
    });
  },

  remove() {
    this.unbind("KeyDown", this._keyHandling);
  },

  setupControls(player) {
    player
      .addComponent(AnalogKeyboardControls)
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

    const MAX_X_SPEED = 700;
    const MAX_Y_SPEED = 500;
    const ACCELLERATE_Y = MAX_Y_SPEED * 8;
    const ACCELLERATE_X = MAX_X_SPEED * 8;

    let yDir = 0;
    let xDir = 0;
    let pressed = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    ship
      .addComponent("Keyboard, Motion")
      .bind("GamePause", function(paused) {
        if (paused) {
          this.disabledBeforePause = this.disableControls;
          this.disableControl();
        } else {
          if (!this.disabledBeforePause) {
            this.enableControl();
          }
        }
      })
      .bind("Move", function() {
        const yLimit = MAX_Y_SPEED * yDir;
        if (
          (this.vy < yLimit && yLimit <= 0 && this.ay < 0) ||
          (this.vy > yLimit && yLimit >= 0 && this.ay > 0)
        ) {
          this.vy = yLimit;
          this.ay = 0;
        }

        const xLimit = MAX_X_SPEED * xDir;
        if (
          (this.vx < xLimit && xLimit <= 0 && this.ax < 0) ||
          (this.vx > xLimit && xLimit >= 0 && this.ax > 0)
        ) {
          this.vx = xLimit;
          this.ax = 0;
        }
      });

    ship.disableControls = false;
    ship.prevSets = {
      ax: ship.ax,
      ay: ship.ay,
      vx: ship.vx,
      vy: ship.vy
    };
    ship.disableControl = function() {
      if (this.disableControls === true) {
        return;
      }
      this.disableControls = true;
      this.prevSets = {
        ax: this.ax,
        ay: this.ay,
        vx: this.vx,
        vy: this.vy
      };
      this.ax = 0;
      this.ay = 0;
      this.vx = 0;
      this.vy = 0;
      xDir = 0;
      yDir = 0;
    };

    ship.enableControl = function() {
      if (this.disableControls === false) {
        return;
      }
      this.disableControls = false;
      this.ax = this.prevSets.ax;
      this.ay = this.prevSets.ay;
      this.vx = this.prevSets.vx;
      this.vy = this.prevSets.vy;
    };

    const updateAcceleration = () => {
      yDir = 0;
      if (pressed.up) {
        yDir -= 1;
      }
      if (pressed.down) {
        yDir += 1;
      }
      yDir = Math.min(1, Math.max(-1, yDir));

      ship.ay += ACCELLERATE_Y * yDir;
      if (ship.vy > 0 && ship.ay === 0) {
        // decellerate
        ship.ay -= ACCELLERATE_Y * 2;
      }
      if (ship.vy < 0 && ship.ay === 0) {
        // decellerate
        ship.ay += ACCELLERATE_Y * 2;
      }

      xDir = 0;
      if (pressed.left) {
        xDir -= 1;
      }
      if (pressed.right) {
        xDir += 1;
      }
      xDir = Math.min(1, Math.max(-1, xDir));
      ship.ax += ACCELLERATE_X * xDir;
      if (ship.vx > 0 && ship.ax === 0) {
        // decellerate
        ship.ax -= ACCELLERATE_X * 2;
      }
      if (ship.vx < 0 && ship.ax === 0) {
        // decellerate
        ship.ax += ACCELLERATE_X * 2;
      }
    };

    this.listenTo(ship, "KeyDown", function(e) {
      if (e.key === controlMap.pause) {
        togglePause();
        pressed = {
          up: false,
          down: false,
          left: false,
          right: false
        };
      }
      if (ship.disableControls) {
        return;
      }
      if (e.key === controlMap.fire) {
        ship.controlPrimary(true);
      }
      if (e.key === controlMap.switchWeapon) {
        ship.controlSwitch(true);
      }
      if (e.key === controlMap.heavy) {
        ship.controlSecondary(true);
      }
      if (e.key === controlMap.shield) {
        ship.controlBlock(true);
      }

      if (e.key === controlMap.up) {
        pressed.up = true;
      }
      if (e.key === controlMap.down) {
        pressed.down = true;
      }
      if (e.key === controlMap.left) {
        pressed.left = true;
      }
      if (e.key === controlMap.right) {
        pressed.right = true;
      }

      updateAcceleration();
    });

    this.listenTo(ship, "KeyUp", function(e) {
      if (ship.disableControls) {
        return;
      }
      if (e.key === controlMap.fire) {
        ship.controlPrimary(false);
      }
      if (e.key === controlMap.switchWeapon) {
        ship.controlSwitch(false);
      }
      if (e.key === controlMap.heavy) {
        ship.controlSecondary(false);
      }
      if (e.key === controlMap.shield) {
        ship.controlBlock(false);
      }

      if (e.key === controlMap.up) {
        pressed.up = false;
      }
      if (e.key === controlMap.down) {
        pressed.down = false;
      }
      if (e.key === controlMap.left) {
        pressed.left = false;
      }
      if (e.key === controlMap.right) {
        pressed.right = false;
      }

      updateAcceleration();
    });
  }
});

export default AnalogKeyboardControls;
