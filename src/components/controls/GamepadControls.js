import { togglePause } from "src/lib/core/pauseToggle";
import Listener from "src/components/generic/Listener";
import Gamepad from "./Gamepad";
import ControlScheme from "src/components/player/ControlScheme";

const GamepadControls = "GamepadControls";

Crafty.c(GamepadControls, {
  init() {
    this.requires(Listener);
    this.bind("RemoveComponent", function(componentName) {
      if (componentName === ControlScheme) {
        this.removeComponent(GamepadControls);
      }
    });
    this.emits = {};
  },

  remove() {
    this.unbind("GamepadKeyChange", this._keyHandling);
  },

  setupControls(player) {
    player
      .addComponent(GamepadControls)
      .controls(this.controlMap)
      .addComponent(ControlScheme);
  },

  controls(controlMap) {
    this.controlMap = controlMap;
    if (controlMap.gamepadIndex == null) {
      return;
    }

    this.requires(Gamepad);
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
      speed: { y: 550, x: 750 },
      gamepadIndex: this.controlMap.gamepadIndex,
      analog: true
    });

    ship.controlName = mapItem => {
      const gamepad = this._getGamepad();
      const button = this.controlMap[mapItem];
      if (gamepad.id) {
        const psController = [
          "sony",
          "dualshock",
          "playstation",
          "sixaxis",
          "ps3",
          "ps3",
          "ps(r)"
        ].some(name => gamepad.id.toLowerCase().indexOf(name) !== -1);
        if (psController) {
          switch (button) {
            case 0:
              return "✖ button";
            case 1:
              return "◯ button";
            case 2:
              return "□ button";
            case 3:
              return "△ button";
            case 4:
              return "Left shoulder button (L1)";
            case 5:
              return "Right shoulder button (R1)";
            case 6:
              return "Left trigger button (L2)";
            case 7:
              return "Right trigger button (R2)";
            case 8:
              return "Share button";
            case 9:
              return "Option button";
            case 10:
              return "Left stick (L3)";
            case 11:
              return "Right stick (R3)";
            case 12:
              return "D-pad up button";
            case 13:
              return "D-pad down button";
            case 14:
              return "D-pad left button";
            case 15:
              return "D-pad right button";
            case 16:
              return "Playstation button";
            case 17:
              return "touchpad";
          }
        }
        //const xboxController = ["xbox", "x-box"].some(
        //name => gamepad.id.toLowerCase().indexOf(name) !== -1
        //);
      }
      let num = "1st";
      switch (button) {
        case 0:
          num = "1st";
          break;
        case 1:
          num = "2nd";
          break;
        case 2:
          num = "3rd";
          break;
        default:
          num = `${button + 1}th`;
          break;
      }

      return `${num} button`;
    };

    this.listenTo(ship, "GamepadKeyChange", e => {
      if (e.button === this.controlMap.fire) {
        ship.controlPrimary(e.pressed);
      }
      if (e.button === this.controlMap.switchWeapon) {
        ship.controlSwitch(e.pressed);
      }
      if (e.button === this.controlMap.heavy) {
        ship.controlSecondary(e.pressed);
      }
      if (e.button === this.controlMap.shield) {
        ship.controlBlock(e.pressed);
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

export default GamepadControls;
