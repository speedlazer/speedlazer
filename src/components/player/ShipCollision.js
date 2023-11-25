import Crafty from "../../crafty";
import DamageSupport from "../DamageSupport";
const ShipCollision = "ShipCollision";

Crafty.c(ShipCollision, {
  required: `Collision, ${DamageSupport}`,
  init() {
    this.onHit("ShipSolid", hits => {
      const delta = this.motionDelta();
      let xCorrection = 0;
      let yCorrection = 0;
      let xDir = 0;
      let yDir = 0;

      hits.map(hitData => {
        let xHitCorrection = 0;
        let yHitCorrection = 0;

        if (hitData.type === "SAT") {
          xHitCorrection -= hitData.overlap * hitData.nx;
          yHitCorrection -= hitData.overlap * hitData.ny;
        } else {
          // MBR
          const { obj } = hitData;
          const d = { x: 0, y: 0 };

          if (
            obj.intersect(this.x - delta.x + d.x, this.y + d.y, this.w, this.h)
          ) {
            yHitCorrection -= delta.y - d.y;
          }

          if (
            obj.intersect(this.x + d.y, this.y - delta.y + d.y, this.w, this.h)
          ) {
            xHitCorrection -= delta.x - d.x;
          }
        }

        if (xHitCorrection !== 0) {
          if (xHitCorrection > 0) {
            if (xDir < 0) {
              this._squashShip();
            }
            xDir = 1;
            xCorrection = Math.max(xCorrection, xHitCorrection);
          } else {
            if (xDir > 0) {
              this._squashShip();
            }
            xDir = -1;
            xCorrection = Math.min(xCorrection, xHitCorrection);
          }
        }

        if (yHitCorrection !== 0) {
          if (yHitCorrection < 0) {
            if (yDir > 0) {
              this._squashShip();
            }
            yDir = -1;
            return (yCorrection = Math.min(yCorrection, yHitCorrection));
          } else {
            if (yDir < 0) {
              this._squashShip();
            }
            yDir = 1;
            return (yCorrection = Math.max(yCorrection, yHitCorrection));
          }
        }
      });
      const x = this.x;
      const y = this.y;

      this.shift(xCorrection, yCorrection);
      if ((x === this.x && xCorrection) || (y === this.y && yCorrection)) {
        // some force (ViewportLocked) pushed ship back.
        this._squashShip();
      }
    });
    this.onHit("PlayerEnemy", () => {
      const damage = {
        velocity: -8e3,
        affects: "health",
        name: "Impact"
      };
      this.processDamage(damage);
    });
    this.onHit("PlayerHit", hits => {
      if (this.health <= 0) return;
      hits.map(hitData => {
        const source = hitData.obj;
        const damage = {
          velocity: -13e3,
          affects: "health",
          name: "Impact"
        };
        source.processDamage && source.processDamage(damage);
      });
    });
  },

  _squashShip() {
    const damage = {
      velocity: -25e3,
      affects: "health",
      name: "Impact"
    };
    this.processDamage(damage);
  }
});

export default ShipCollision;
