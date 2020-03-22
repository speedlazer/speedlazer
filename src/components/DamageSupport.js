import StackableCoordinates from "./StackableCoordinates";
import { isPaused } from "src/lib/core/pauseToggle";
import {
  applyForce,
  addEffect,
  normalize,
  processEffects
} from "src/lib/effects";

const applyHitFlash = (entity, onOff) =>
  entity.forEachPart(part =>
    part.attr({
      hitFlash: onOff ? { _red: 1, _green: 1, _blue: 1 } : false
    })
  );

const processor = processEffects({
  position: (amount, effect, target) => {
    if (target.weight === undefined) return {};
    const [normX, normY] = normalize(
      effect.origin.x,
      effect.origin.y,
      target.x,
      target.y
    );
    return {
      xForce: normX,
      yForce: normY
    };
  }
});

const DamageSupport = "DamageSupport";

Crafty.c(DamageSupport, {
  required: StackableCoordinates,
  events: {
    EnterFrame: "_handleEffects"
  },

  init() {
    this.createStackablePropertyFor("xMomentumShift", "x");
    this.createStackablePropertyFor("yMomentumShift", "y");
    this.attr({
      health: 0,
      vulnerable: false,
      xMomentum: 0,
      yMomentum: 0,
      xMomentumShift: 0,
      yMomentumShift: 0,
      xForce: 0,
      yForce: 0
    });
    this.allowDamage = this.allowDamage.bind(this);
    this.hasHealth = this.hasHealth.bind(this);
  },

  allowDamage({ health }) {
    this.attr({
      vulnerable: true,
      health
    });
  },

  stopDamage() {
    this.attr({
      vulnerable: false
    });

    applyHitFlash(this, false);
  },

  hasHealth() {
    const health = this.attr("health");
    return health > 0;
  },

  processDamage(damage) {
    if (isPaused()) {
      return;
    }
    if (this.hidden) {
      return;
    }
    if (this.vulnerable) {
      const target = this;
      [].concat(damage).forEach(d => addEffect(target, d));
    }
  },

  _handleEffects({ dt }) {
    //if (!this.effects) return;
    const changes = processor(this, dt);
    //if (changes === false) {
    //applyHitFlash(this, false);
    //return;
    //}

    if (this.xMomentum > 0 || changes) {
      this.xMomentum = applyForce(
        this.xMomentum,
        Math.abs((changes && changes.xForce) || 0),
        (this.weight || 0) * 200
      );
    }
    if (this.yMomentum > 0 || changes) {
      this.yMomentum = applyForce(
        this.yMomentum,
        Math.abs((changes && changes.yForce) || 0),
        (this.weight || 0) * 200
      );
    }

    if (changes !== false) {
      Object.assign(this, changes);
    }

    this.xMomentumShift += this.xMomentum * this.xForce;
    this.yMomentumShift += this.yMomentum * this.yForce;

    applyHitFlash(this, Object.keys(changes).includes("health"));
    if (this.health <= 0) {
      this.stopDamage();
      this.trigger("Dead");
    }
  }
});

export default DamageSupport;
