import { togglePause } from "src/lib/core/pauseToggle";

Crafty.c("GamepadControls", {
  init() {
    this.requires("Listener");
    this.bind("RemoveComponent", function(componentName) {
      if (componentName === "ControlScheme") {
        this.removeComponent("GamepadControls");
      }
    });
    this.emits = {};
  },

  remove() {
    this.unbind("GamepadKeyChange", this._keyHandling);
  },

  setupControls(player) {
    player
      .addComponent("GamepadControls")
      .controls(this.controlMap)
      .addComponent("ControlScheme");
  },

  controls(controlMap) {
    this.controlMap = controlMap;
    if (controlMap.gamepadIndex == null) {
      return;
    }

    this.requires("Gamepad");
    this.gamepad(controlMap.gamepadIndex);

    this.bind("GamepadKeyChange", this._keyHandling);
    this.bind("GamepadAxisChange", this._stickHandling);
    return this;
  },

  _stickHandling(e) {
    // TODO: Detect start motion, start emitting 'up / down', 'left / right'
    // Detect end motion
    //
    //   axis: j,
    //   value: gamepad.axes[j]
    let direction;
    if (e.axis === 1) {
      // left stick: up / down
      direction = "vertical";
      if (e.value < -0.5) {
        this._startEmit(direction, "Up");
      } else if (e.value > 0.5) {
        this._startEmit(direction, "Down");
      } else {
        this._stopEmit(direction);
      }
    }

    if (e.axis === 0) {
      // left stick: left / right
      direction = "horizontal";
      if (e.value < -0.5) {
        this._startEmit(direction, "Left");
      } else if (e.value > 0.5) {
        this._startEmit(direction, "Right");
      } else {
        this._stopEmit(direction);
      }
    }
  },

  _startEmit(axis, value) {
    if ((this.emits[axis] && this.emits[axis].value) === value) {
      return;
    }
    this._stopEmit(axis);
    this.trigger(value);
    this.emits[axis] = {
      interval: setInterval(() => {
        this.trigger(value);
      }, 200),
      value
    };
  },

  _stopEmit(axis) {
    clearInterval(this.emits[axis] && this.emits[axis].interval);
    return delete this.emits[axis];
  },

  _keyHandling(e) {
    if (
      this.lastPressed &&
      this.lastPressed.getTime() > new Date().getTime() - 200
    ) {
      return;
    }
    this.lastPressed = new Date();
    if (e.button === this.controlMap.fire && e.pressed) {
      this.trigger("Fire", e);
    }
    if (e.button === this.controlMap.up && e.pressed) {
      this.trigger("Up", e);
    }
    if (e.button === this.controlMap.down && e.pressed) {
      this.trigger("Down", e);
    }
    if (e.button === this.controlMap.left && e.pressed) {
      this.trigger("Left", e);
    }
    if (e.button === this.controlMap.right && e.pressed) {
      this.trigger("Right", e);
    }
  },

  assignControls(ship) {
    ship.addComponent("GamepadMultiway").gamepadMultiway({
      speed: { y: 500, x: 500 },
      gamepadIndex: this.controlMap.gamepadIndex,
      analog: true
    });

    this.listenTo(ship, "GamepadKeyChange", e => {
      if (e.button === this.controlMap.fire) {
        ship.shoot(e.pressed);
      }
      if (e.button === this.controlMap.switchWeapon) {
        ship.switchWeapon(e.pressed);
      }
      if (e.button === this.controlMap.super) {
        ship.superWeapon(e.pressed);
      }

      // TODO: This event is not coming through
      // when the game is paused,
      // so unpausing is not possible!
      if (e.button === this.controlMap.pause) {
        if (e.pressed) {
          togglePause();
        }
      }
    });
  }
});
