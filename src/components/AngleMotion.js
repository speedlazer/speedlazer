const AngleMotion = "AngleMotion";

Crafty.c(AngleMotion, {
  properties: {
    velocity: {
      set: function(value) {
        this._velocity = value;
        this._setAngleAndVelocity(this._angle, this._velocity);
      },
      get: function() {
        return this._velocity;
      },
      configurable: true,
      enumerable: true
    },
    _velocity: { value: 0, writable: true, enumerable: false },

    angle: {
      set: function(value) {
        this._angle = value;
        this._setAngleAndVelocity(this._angle, this._velocity);
      },
      get: function() {
        return this._angle;
      },
      configurable: true,
      enumerable: true
    },
    _angle: { value: 0, writable: true, enumerable: false }
  },

  _setAngleAndVelocity(angle, velocity) {
    if (velocity === 0) {
      this.attr({
        vy: 0,
        vx: 0
      });
      return;
    }
    this.attr({
      vy: -Math.sin((angle / 180) * Math.PI) * velocity,
      vx: -Math.cos((angle / 180) * Math.PI) * velocity
    });
  }
});

export default AngleMotion;
