import defaults from "lodash/defaults";

const Acceleration = "Acceleration";

Crafty.c(Acceleration, {
  init() {
    this._currentSpeed = { x: 0, y: 0 };
    this._targetSpeed = { x: 0, y: 0 };
    this._accelerate = { x: 0.01, y: 0.01 };
    this._currentAcceleration = { x: 0, y: 0 };
  },

  updateAcceleration() {
    this._handleAcceleration("x");
    this._handleAcceleration("y");
  },

  targetSpeed(speed, options) {
    if (options == null) {
      options = {};
    }
    options = defaults(options, { accellerate: true });
    if (options.accellerate) {
      this._accelerate = { x: 0.01, y: 0.01 };
    } else {
      this._accelerate = { x: Infinity, y: Infinity };
    }

    if (speed.x != null && speed.y != null) {
      this._targetSpeed.x = speed.x;
      this._targetSpeed.y = speed.y;
    } else {
      this._targetSpeed.x = speed;
      this._targetSpeed.y = 0;
    }
    return this;
  },

  _handleAcceleration(axis) {
    if (this._currentSpeed[axis] === this._targetSpeed[axis]) {
      return;
    }
    let a = 1;
    if (this._currentSpeed[axis] > this._targetSpeed[axis]) {
      a = -1;
    }

    this._currentAcceleration[axis] += this._accelerate[axis] * a;
    this._currentSpeed[axis] += this._currentAcceleration[axis];

    if (
      this._currentAcceleration[axis] > 0 &&
      this._currentSpeed[axis] < this._targetSpeed[axis]
    ) {
      return;
    }
    if (
      this._currentAcceleration[axis] < 0 &&
      this._currentSpeed[axis] > this._targetSpeed[axis]
    ) {
      return;
    }

    this._currentSpeed[axis] = this._targetSpeed[axis];
    this._currentAcceleration[axis] = 0;
  }
});

export default Acceleration;
