const Steering = "Steering";

Crafty.c(Steering, {
  properties: {
    steering: {
      set: function(value) {
        if (this._steering !== value) {
          this._steering = value;
          if (value === 0) {
            this.unbind("EnterFrame", this._updateSteering);
          } else {
            this._updateSteering({ dt: 1 });
            this.uniqueBind("EnterFrame", this._updateSteering);
          }
        }
      },
      get: function() {
        return this._steering;
      },
      configurable: true,
      enumerable: true
    },
    _steering: { value: 0, writable: true, enumerable: false }
  },

  _updateSteering({ dt }) {
    if (!this.currentTarget && this.target) {
      const potentialTargets = Crafty(this.target);
      if (potentialTargets.length > 0) {
        this.currentTarget = Crafty(
          potentialTargets[Math.floor(Math.random() * potentialTargets.length)]
        );
      }
    }
    if (!this.currentTarget) return;
    const targetLocation = {
      x: this.currentTarget.x + this.currentTarget.w / 2,
      y: this.currentTarget.y + this.currentTarget.h / 2
    };

    const aimVector = {
      x: this.x - targetLocation.x,
      y: this.y - targetLocation.y
    };
    const radians = Math.atan2(aimVector.y, aimVector.x);
    const aimAngle = (radians / Math.PI) * 180;

    const steering = (this._steering / 1000) * dt;

    const diffA = (aimAngle - this.angle - 360) % 360;
    const diffB = (aimAngle - this.angle + 360) % 360;
    const diff = Math.abs(diffA) < Math.abs(diffB) ? diffA : diffB;

    if (this.sight && (diff > this.sight || diff < -this.sight)) return;

    if (diff > steering) {
      this.attr({
        angle: (360 + this.angle + steering) % 360,
        rotation: this.autoRotate
          ? this.rotation
          : (360 + this.rotation + steering) % 360
      });
    } else if (diff < -steering) {
      this.attr({
        angle: (360 + this.angle - steering) % 360,
        rotation: this.autoRotate
          ? this.rotation
          : (360 + this.rotation - steering) % 360
      });
    } else {
      this.attr({
        angle: (360 + aimAngle) % 360,
        rotation: this.autoRotate ? this.rotation : (360 + aimAngle) % 360
      });
    }
  }
});

export default Steering;
