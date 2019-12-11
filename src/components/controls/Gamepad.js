/* Gives entities gamepad events.
 *
 * NOTE: The HTML5 Gamepad API is yet experimental and subject to change.
 *       Expect this code to break until the Gamepad API is stable.
 *       So far has only been tested with Google Chrome and Xbox 360
 *       controllers.
 *
 * Since a gamepad can have analog buttons with states between 0.0 and 1.0
 * (LT and RT on a Xbox 360 controller for example) there are no such
 * events like KeyDown or KeyUp but only GamepadKeyChange. The event object
 * contains the properties "button" (index of button) and "value".
 * Receivers of these events must decide whether a button is pressed by
 * applying a threshold, for instance.
 *
 * Same goes for axes events which are fired as GamepadAxisChange. The event
 * objects has the properties "axis" (index of axis) and "value".
 *
 * The index of the gamepad which this component is listening for has
 * to be specified when calling the constructor gamepad(index).
 *
 * Important: Gamepads will only be reported by the Gamepad API once a button
 * on the desired gamepad has been pressed.
 *
 * For a nice Gamepad API tutorial see
 * http://www.html5rocks.com/en/tutorials/doodles/gamepad/
 *
 * @version 0.0.1
 * @author Sven Jacobs <mail@svenjacobs.com>
 */
const Gamepad = "Gamepad";

Crafty.c(Gamepad, {
  _gpEnterFrame: function() {
    var gamepad = this._getGamepad(this._gamepadIndex);

    // Only evaluate buttons/axes when we found a gamepad and there
    // have been changes according to timestamp.
    if (gamepad && gamepad.timestamp !== this._timestamp) {
      this._timestamp = gamepad.timestamp;
      this._emitGamepadEvents(gamepad);
    }
  },

  _emitGamepadEvents: function(gamepad) {
    for (var i = 0; i < gamepad.buttons.length; i++) {
      if (
        (this._buttonsState[i] !== undefined &&
          this._buttonsState[i] !== gamepad.buttons[i].value) ||
        (this._buttonsState[i] === undefined &&
          gamepad.buttons[i].value !== 0.0)
      ) {
        this.trigger("GamepadKeyChange", {
          button: i,
          value: gamepad.buttons[i].value,
          pressed: gamepad.buttons[i].pressed
        });
      }

      this._buttonsState[i] = gamepad.buttons[i].value;
    }

    for (var j = 0; j < gamepad.axes.length; j++) {
      if (
        (this._axesState[j] !== undefined &&
          this._axesState[j] !== gamepad.axes[j]) ||
        (this._axesState[j] === undefined && gamepad.axes[j] !== 0.0)
      ) {
        this.trigger("GamepadAxisChange", {
          axis: j,
          value: gamepad.axes[j]
        });
      }
    }
  },

  _getGamepad: function() {
    var gamepad = null,
      fun = navigator.getGamepads || navigator.webkitGetGamepads;

    if (fun) {
      gamepad = fun.apply(navigator)[this._gamepadIndex];
    }

    return gamepad;
  },

  /* Constructor
   *
   * Specify index of gamepad as first argument.
   */
  gamepad: function(gamepadIndex) {
    this._gamepadIndex = gamepadIndex || 0;
    this._timestamp = 0;
    this._buttonsState = [];
    this._axesState = [];

    this.bind("EnterFrame", this._gpEnterFrame);

    return this;
  }
});

/* Controls an entity with a gamepad.
 *
 * The index of the gamepad and other options need to be specified
 * when calling the constructor (mandatory!), see gamepadMultiway().
 */
Crafty.c("GamepadMultiway", {
  _AXIS_THRESHOLD: 0.75,
  _AXIS_ANALOG_THRESHOLD: 0.1,

  // Key is index of gamepad.buttons[] array for specific key,
  // value is direction in degrees.
  _BUTTONS_DIRECTION: {
    12: -90, // pad top
    13: 90, // pad bottom
    14: 180, // pad left
    15: 0 // pad right
  },

  // Key is index of gamepad.axes[] and value is an array where first
  // index describes degrees of value -1.0 (completely left or up)
  // and second index degrees of value 1.0 (completely right or down).
  // A threshold is applied to analog values, see above.
  _AXES_DIRECTION: {
    0: [180, 0], // left horizontal
    1: [-90, 90], // left vertical
    2: [180, 0], // right horizontal
    3: [-90, 90] // right vertical
  },

  init: function() {
    this.requires("Motion, Gamepad");
  },

  _gamepadKeyChange: function(e) {
    if (this.disableControls) return;
    if (e.button in this._BUTTONS_DIRECTION) {
      if (e.value === 1.0 && this._buttonsPressed.indexOf(e.button) === -1) {
        this.vx =
          Math.round((this.vx + this._buttons[e.button].x) * 1000) / 1000;
        this.vy =
          Math.round((this.vy + this._buttons[e.button].y) * 1000) / 1000;
        this._buttonsPressed.push(e.button);
      } else if (
        e.value === 0.0 &&
        this._buttonsPressed.indexOf(e.button) !== -1
      ) {
        this.vx =
          Math.round((this.vx - this._buttons[e.button].x) * 1000) / 1000;
        this.vy =
          Math.round((this.vy - this._buttons[e.button].y) * 1000) / 1000;
        this._buttonsPressed.splice(this._buttonsPressed.indexOf(e.button), 1);
      }
    }
  },

  _gamepadAxisChange: function(e) {
    if (this.disableControls) return;
    if (e.axis in this._AXES_DIRECTION) {
      if (this._analogControl) {
        this._analogHandling(e);
      } else {
        this._digitalHandling(e);
      }
    }
  },

  _digitalHandling: function(e) {
    if (e.value <= -this._AXIS_THRESHOLD || e.value >= this._AXIS_THRESHOLD) {
      var dir = e.value < 0 ? 0 : 1,
        id = e.axis + ":" + dir;

      if (this._axesPressed.indexOf(id) !== -1) {
        return;
      }

      this.vx = Math.round((this.vx + this._axes[e.axis][dir].x) * 1000) / 1000;
      this.vy = Math.round((this.vy + this._axes[e.axis][dir].y) * 1000) / 1000;
      // store axes index and direction (0 = left/up, 1 = right/down)
      this._axesPressed.push(id);
    } else {
      for (var i = 0; i < this._axesPressed.length; i++) {
        var ap = this._axesPressed[i];
        // direction had been pressed before and now was released
        if (parseInt(ap.substr(0, 1), 10) === e.axis) {
          var s = ap.split(":");

          this.vx =
            Math.round(
              (this.vx - this._axes[e.axis][parseInt(s[1], 10)].x) * 1000
            ) / 1000;
          this.vy =
            Math.round(
              (this.vy - this._axes[e.axis][parseInt(s[1], 10)].y) * 1000
            ) / 1000;
          this._axesPressed.splice(this._axesPressed.indexOf(ap), 1);
        }
      }
    }
  },

  _analogHandling: function(e) {
    if (
      e.value <= -this._AXIS_ANALOG_THRESHOLD ||
      e.value >= this._AXIS_ANALOG_THRESHOLD
    ) {
      if (e.axis === 0) {
        // left / right
        this.vx = e.value * this._speed.x;
      }
      if (e.axis === 1) {
        // up / down
        this.vy = e.value * this._speed.y;
      }
    } else {
      if (e.axis === 0) {
        // left / right
        this.vx = 0;
      }
      if (e.axis === 1) {
        // up / down
        this.vy = 0;
      }
    }
  },

  _calcSpeed: function(speed) {
    for (var b in this._BUTTONS_DIRECTION) {
      this._buttons[b] = {
        x:
          Math.round(
            Math.cos(this._BUTTONS_DIRECTION[b] * (Math.PI / 180)) *
              1000 *
              speed.x
          ) / 1000,
        y:
          Math.round(
            Math.sin(this._BUTTONS_DIRECTION[b] * (Math.PI / 180)) *
              1000 *
              speed.y
          ) / 1000
      };
    }

    for (var a in this._AXES_DIRECTION) {
      this._axes[a] = [];
      this._axes[a][0] = {
        x:
          Math.round(
            Math.cos(this._AXES_DIRECTION[a][0] * (Math.PI / 180)) *
              1000 *
              speed.x
          ) / 1000,
        y:
          Math.round(
            Math.sin(this._AXES_DIRECTION[a][0] * (Math.PI / 180)) *
              1000 *
              speed.y
          ) / 1000
      };
      this._axes[a][1] = {
        x:
          Math.round(
            Math.cos(this._AXES_DIRECTION[a][1] * (Math.PI / 180)) *
              1000 *
              speed.x
          ) / 1000,
        y:
          Math.round(
            Math.sin(this._AXES_DIRECTION[a][1] * (Math.PI / 180)) *
              1000 *
              speed.y
          ) / 1000
      };
    }
  },

  /* Constructor
   *
   * Takes a configuration object which may contain the following
   * properties:
   *
   * speed: either a number describing the speed in pixel for both
   *        directions (x, y) or an object with properties "x" and "y"
   *        describing speed individually, e.g. "{x: 2, y: 3}"
   *
   * gamepadIndex: Index (zero-based) of gamepad to use
   */
  gamepadMultiway: function(config) {
    config = config || {};

    this.requires("Gamepad");
    this.gamepad(config.gamepadIndex || 0);

    this._speed = { x: 150, y: 150 };
    this._buttons = {};
    this._buttonsPressed = [];
    this._axes = {};
    this._axesPressed = [];
    this._speedOnAxes = {};
    this._analogControl = false || config.analog;

    if (config.speed) {
      if (config.speed.x && config.speed.y) {
        this._speed.x = config.speed.x;
        this._speed.y = config.speed.y;
      } else {
        this._speed.x = config.speed;
        this._speed.y = config.speed;
      }
    }

    this._calcSpeed(this._speed);

    this.bind("GamepadKeyChange", this._gamepadKeyChange);
    this.bind("GamepadAxisChange", this._gamepadAxisChange);

    return this;
  },

  /**@
   * #.enableControl
   * @comp GamepadMultiway
   * @sign public this .enableControl()
   *
   * Enable the component to listen to axis events.
   *
   * @example
   * ~~~
   * this.enableControl();
   * ~~~
   */
  enableControl: function() {
    this.disableControls = false;
    if (this.disabledVelocities !== undefined) {
      this.vx = this.disabledVelocities.x;
      this.vy = this.disabledVelocities.y;
    }
    this.disabledVelocities = undefined;
    return this;
  },

  /**@
   * #.disableControl
   * @comp GamepadMultiway
   * @sign public this .disableControl()
   *
   * Disable the component to listen to axis events.
   *
   * @example
   * ~~~
   * this.disableControl();
   * ~~~
   */

  disableControl: function() {
    this.disableControls = true;
    this.disabledVelocities = {
      x: this.vx,
      y: this.vy
    };
    this.vx = 0;
    this.vy = 0;
    return this;
  }
});

export default Gamepad;
