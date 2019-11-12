import compositions from "src/data/compositions";
import Composable from "src/components/Composable";
import AngleMotion from "src/components/AngleMotion";
import { tweenFn } from "src/components/generic/TweenPromise";
import { easingFunctions } from "src/constants/easing";

const adjustForDifficulty = (difficulty, numberOrArray, defaultValue = 0) =>
  numberOrArray === undefined
    ? defaultValue
    : typeof numberOrArray === "number"
    ? numberOrArray
    : typeof numberOrArray === "string"
    ? numberOrArray
    : numberOrArray[0] + (numberOrArray[1] - numberOrArray[0]) * difficulty;

const middle = obj => ({ x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 });

const calcHitPosition = (objA, objB) => {
  const mA = middle(objA);
  const mB = middle(objB);
  return {
    x: (mA.x + mB.x) / 2,
    y: (mA.y + mB.y) / 2
  };
};

const Bullet = "Bullet";

Crafty.c(Bullet, {
  required: `2D, Motion, WebGL, ${AngleMotion}`,

  init() {
    this.bind("HitOn", this._bulletHit);
  },

  _bulletHit(collisionType, hitData) {
    const collisionConfig = this.bulletSettings.collisions[collisionType];
    const firstObj = hitData[0].obj;
    const position = calcHitPosition(this, firstObj);
    (collisionConfig.spawns || []).forEach(([name, settings]) => {
      spawnItem(this.weaponDefinition, name, settings, firstObj, position);
    });

    this.bulletTime = 0;
    this.unbind("EnterFrame", this._updateBullet);
    this.freeze();
  },

  bullet(weaponDefinition, itemSettings, overrideSettings, initialAngle) {
    this.weaponDefinition = weaponDefinition;
    this.bulletSettings = { ...itemSettings };
    this.bulletSettings.queue = (this.bulletSettings.queue || []).map(event =>
      Object.entries(event).reduce(
        (a, [k, v]) => ({
          ...a,
          [k]: adjustForDifficulty(this.difficulty, v)
        }),
        {}
      )
    );

    const initialVelocity = adjustForDifficulty(
      this.difficulty,
      itemSettings.velocity
    );

    this.attr({ angle: initialAngle, velocity: initialVelocity });

    // add lifecycle stuff, bullet entity pools, etc.
    this.bulletTime = 0;
    this.bulletDefinition = itemSettings;
    this.maxBulletTime = itemSettings.queue.reduce((max, item) => {
      const delay = adjustForDifficulty(this.difficulty, item.delay);
      const duration = adjustForDifficulty(this.difficulty, item.duration);
      return max + delay + duration;
    }, 0);

    this.uniqueBind("EnterFrame", this._updateBullet);
  },

  _updateBullet({ dt }) {
    this.bulletTime += dt;

    const upcoming = this.bulletSettings.queue[0];
    if (upcoming) {
      upcoming.delay = (upcoming.delay || 0) - dt;
      const localV =
        (upcoming.duration - (upcoming.duration + upcoming.delay)) /
        upcoming.duration;
      if (upcoming.delay < 0 && (upcoming.duration || 0) === 0) {
        if (upcoming.velocity !== undefined) {
          this.attr({ velocity: upcoming.velocity });
        }
      }
      if (upcoming.delay < 0 && upcoming.duration > 0) {
        if (!upcoming.animateFn && upcoming.velocity !== undefined) {
          const animateFn = tweenFn(this, {
            velocity: upcoming.velocity
          });
          const easing = easingFunctions[upcoming.easing || "linear"];
          upcoming.animateFn = t => animateFn(easing(t));
        }
        if (upcoming.animateFn) {
          upcoming.animateFn(localV);
        }
      }
      if (localV > 1) {
        this.bulletSettings.queue.shift();
      }
    }

    if (this.bulletTime > this.maxBulletTime) {
      this.unbind("EnterFrame", this._updateBullet);
      this.bulletTime = 0;
      this.freeze();
    }
  }
});

let pool = [];
Crafty.bind("SceneDestroy", () => (pool = []));

const getItemFromPool = itemDefinition => {
  const available = pool.find(
    e => e.__frozen && e.bulletDefinition === itemDefinition
  );
  if (available) {
    available.unfreeze();
    return available;
  }

  const spawn = Crafty.e(Bullet).attr({
    x: 3000,
    y: 3000
  });
  if (itemDefinition.sprite) {
    spawn.addComponent(itemDefinition.sprite);
  }
  if (itemDefinition.composition) {
    spawn
      .addComponent(Composable)
      .compose(compositions[itemDefinition.composition]);
  }
  const collisionChecks = Object.keys(itemDefinition.collisions || {});
  if (collisionChecks.length > 0) {
    spawn.addComponent("Collision");
    collisionChecks.forEach(collisionType => {
      spawn.onHit(collisionType, hitDatas => {
        spawn._bulletHit(collisionType, hitDatas);
      });
    });
  }

  pool = pool.concat(spawn);
  return spawn;
};

const spawnItem = (definition, itemName, itemSettings, spawner, position) => {
  const itemDef = definition.spawnables[itemName];

  const spawn = getItemFromPool(itemDef);
  spawn.attr({
    difficulty: spawner.difficulty
  });
  const angle = position.angle + ({ ...itemDef, ...itemSettings }.angle || 0);
  if (typeof itemDef.spawnPosition === "object") {
    spawn.attr({
      x: position.x - spawn._origin.x,
      y: position.y - spawn._origin.y,
      z: spawner.z,
      rotation: angle
    });
  }
  if (typeof itemDef.spawnPosition === "string") {
    spawn.attr({
      x: position.x - spawn.w / 2,
      y: position.y - spawn.h / 2,
      z: spawner.z,
      rotation: angle
    });
  }

  spawn.bullet(definition, itemDef, itemSettings, angle);
};

const Weapon = "Weapon";

Crafty.c(Weapon, {
  init() {
    this.weapons = [];
  },

  weapon(name, definition) {
    this.weapons.push({ name, state: {}, definition, active: false });
    return this;
  },

  activateWeapon(name) {
    const weapon = this.weapons.find(w => w.name === name);
    if (weapon.active === true) {
      return this;
    }
    weapon.active = true;
    weapon.activatedAt = new Date() * 1;

    weapon.initialDelay = adjustForDifficulty(
      this.difficulty,
      weapon.definition.pattern.spawnRhythm.initialDelay
    );
    this.uniqueBind("EnterFrame", this._updateSpawnFrame);
    return this;
  },

  _weaponSpawn(w) {
    w.definition.pattern.spawns.forEach(([name, overrideSettings]) => {
      spawnItem(w.definition.pattern, name, overrideSettings, this, {
        x: this.x + w.definition.x,
        y: this.y + w.definition.y,
        angle: w.definition.angle
      });
    });
  },

  _updateSpawnFrame({ dt }) {
    this.weapons.forEach(w => {
      const spawnRhythm = w.definition.pattern.spawnRhythm;

      if (w.initialDelay > 0) {
        w.initialDelay -= dt;
        if (w.initialDelay <= 0) {
          this._weaponSpawn(w);
          w.shotIndex = 0;
          w.shotDelay = adjustForDifficulty(
            this.difficulty,
            spawnRhythm.shotDelay
          );
        }
        return;
      }
      w.shotDelay -= dt;
      if (w.shotDelay <= 0) {
        w.shotIndex++;
        if (
          w.shotIndex >= adjustForDifficulty(this.difficulty, spawnRhythm.burst)
        ) {
          w.initialDelay = adjustForDifficulty(
            this.difficulty,
            spawnRhythm.burstDelay
          );
        } else {
          this._weaponSpawn(w);
          w.shotDelay = adjustForDifficulty(
            this.difficulty,
            spawnRhythm.shotDelay
          );
        }
      }
    });
  }
});

export default Weapon;
