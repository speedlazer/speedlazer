import compositions from "src/data/compositions";
import ParticleEmitter from "src/components/ParticleEmitter";
import particles from "src/data/particles";
import Composable from "src/components/Composable";
import AngleMotion from "src/components/AngleMotion";
import Steering from "src/components/Steering";
import { EntityDefinition } from "src/components/EntityDefinition";
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

const applyDifficultyToObj = (difficulty, obj) =>
  obj &&
  Object.entries(obj).reduce(
    (a, [k, v]) => ({
      ...a,
      [k]: adjustForDifficulty(difficulty, v)
    }),
    {}
  );

const ScreenBound = "ScreenBound";
Crafty.c(ScreenBound, {
  required: "2D",

  init() {
    this.bind("UpdateFrame", this._checkBounds);
  },

  _checkBounds() {
    const maxX =
      -Crafty.viewport._x +
      Crafty.viewport._width / Crafty.viewport._scale +
      10;
    const minX = -Crafty.viewport._x - 50;

    const maxY =
      -Crafty.viewport._y +
      Crafty.viewport._height / Crafty.viewport._scale +
      10;
    const minY = -Crafty.viewport._y - 50;

    if (this.x > maxX || minX > this.x || minY > this.y || this.y > maxY) {
      this.freeze();
    }
  }
});

const calcHitPosition = (objA, objB) => {
  let x = null;
  let y = null;

  const xLeftOverlap =
    (objA.x < objB.x && objA.w + objA.x > objB.x) ||
    (objA.vx !== undefined && objA.vx > 0);
  const xRightOverlap =
    (objA.x < objB.x + objB.w && objA.x + objA.w > objB.x) ||
    (objA.vx !== undefined && objA.vx < 0);

  const yTopOverlap = objA.y < objB.y && objA.h + objA.y > objB.y;
  const yBottomOverlap = objA.y < objB.w + objB.h && objA.y + objA.h > objB.y;

  if (xLeftOverlap && (!yTopOverlap && !yBottomOverlap)) {
    x = objB.x;
    y = objA.y + objA.h / 2;
  } else if (xRightOverlap && (!yTopOverlap && !yBottomOverlap)) {
    x = objB.x + objB.w;
    y = objA.y + objA.h / 2;
  } else if (yTopOverlap) {
    x = objA.x + objA.w / 2;
    y = objB.y;
  } else if (yBottomOverlap) {
    x = objA.x + objA.w / 2;
    y = objB.y + objB.h;
  }

  return { x, y };
};

const Bullet = "Bullet";

Crafty.c(Bullet, {
  required: `2D, Motion, WebGL, ${AngleMotion}`,

  _bulletHit(collisionType, hitData) {
    const collisionConfig = this.bulletSettings.collisions[collisionType];
    const firstObj = hitData[0].obj;
    const position = calcHitPosition(this, firstObj);

    firstObj.processDamage &&
      firstObj.processDamage(this.bulletSettings.damage);

    (collisionConfig.spawns || []).forEach(([name, settings]) => {
      spawnItem(
        this.weaponDefinition,
        name,
        settings,
        firstObj,
        position,
        this.target
      );
    });

    this.unbind("EnterFrame", this._updateBullet);
    this.bulletTime = 0;
    this.freeze();
  },

  bullet(weaponDefinition, settings, target) {
    this.weaponDefinition = weaponDefinition;
    this.bulletSettings = { ...settings };
    this.bulletSettings.queue = (this.bulletSettings.queue || []).map(
      event => ({
        duration: 0,
        delay: 0,
        ...applyDifficultyToObj(this.difficulty, event)
      })
    );
    this.bulletSettings.damage = applyDifficultyToObj(
      this.difficulty,
      settings.damage
    );

    const initialVelocity = adjustForDifficulty(
      this.difficulty,
      settings.velocity
    );

    this.attr({ angle: settings.angle, velocity: initialVelocity, target });

    // add lifecycle stuff, bullet entity pools, etc.
    this.bulletTime = 0;
    this.maxBulletTime = this.bulletSettings.queue.reduce(
      (max, item) => max + adjustForDifficulty(this.difficulty, item.duration),
      0
    );

    this.uniqueBind("EnterFrame", this._updateBullet);
  },

  _updateBullet({ dt }) {
    this.bulletTime += dt;

    const upcoming = this.bulletSettings.queue[0];
    if (upcoming) {
      upcoming.delay = (upcoming.delay || 0) - dt;
      const localV =
        upcoming.duration === 0
          ? 1
          : (upcoming.duration - (upcoming.duration + upcoming.delay)) /
            upcoming.duration;

      if (upcoming.delay <= 0 && upcoming.duration === 0) {
        if (upcoming.velocity !== undefined) {
          this.attr({ velocity: upcoming.velocity });
        }
        if (upcoming.angle !== undefined) {
          this.attr({ angle: upcoming.angle });
        }
        if (upcoming.cleanOutOfScreen !== undefined) {
          this.addComponent(ScreenBound);
        }
        if (upcoming.steering !== undefined) {
          this.addComponent(Steering).attr({ steering: upcoming.steering });
        }
        if (upcoming.aimOnTarget !== undefined) {
          const potentialTargets = Crafty(this.target);
          if (potentialTargets.length > 0) {
            const target = Crafty(
              potentialTargets[
                Math.floor(Math.random() * potentialTargets.length)
              ]
            );
            const targetLocation = {
              x: target.x + target.w / 2,
              y: target.y + target.h / 2
            };

            const aimVector = {
              x: this.x - targetLocation.x,
              y: this.y - targetLocation.y
            };
            const radians = Math.atan2(aimVector.y, aimVector.x);
            const angle = (radians / Math.PI) * 180;

            this.attr({ angle, rotation: angle });
          }
        }
      }
      if (upcoming.duration > 0) {
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
      if (localV >= 1) {
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
    y: 3000,
    angle: 0,
    rotation: 0
  });
  spawn.bulletDefinition = itemDefinition;
  if (itemDefinition.sprite) {
    spawn.addComponent(itemDefinition.sprite);
  }
  if (itemDefinition.composition) {
    const composeData = compositions[itemDefinition.composition];
    spawn.addComponent(Composable).compose(composeData);
  }
  if (itemDefinition.particles) {
    const particleData = particles[itemDefinition.particles];
    Crafty.e(ParticleEmitter).particles(particleData, spawn);
  }
  if (itemDefinition.entity) {
    spawn.addComponent(EntityDefinition).applyDefinition(itemDefinition.entity);
  }
  const collisionChecks = Object.keys(itemDefinition.collisions || {});
  if (collisionChecks.length > 0) {
    if (!spawn.has("Collision")) {
      spawn.addComponent("Collision");
    }

    collisionChecks.forEach(collisionType => {
      spawn.onHit(collisionType, hitDatas => {
        spawn._bulletHit(collisionType, hitDatas);
      });
    });
  }

  pool = pool.concat(spawn);
  return spawn;
};

const generator = (itemDef, itemSettings, position, difficulty, f) => {
  const settings = { ...itemDef, ...itemSettings };
  if (settings.angleRange) {
    for (
      let spawnAngle = adjustForDifficulty(
        difficulty,
        settings.angleRange.from
      );
      spawnAngle <= adjustForDifficulty(difficulty, settings.angleRange.to);
      spawnAngle += adjustForDifficulty(difficulty, settings.angleRange.step)
    ) {
      const angle = position.angle + spawnAngle;
      f({ ...settings, angle });
    }
  } else {
    const angle =
      position.angle + ({ ...settings, ...itemSettings }.angle || 0);
    f({ ...settings, angle });
  }
};

const spawnItem = (
  definition,
  itemName,
  itemSettings,
  spawner,
  position,
  target
) => {
  const itemDef = definition.spawnables[itemName];
  generator(itemDef, itemSettings, position, spawner.difficulty, settings => {
    const spawn = getItemFromPool(itemDef);
    const autoRotate = settings.autoRotate !== false;
    spawn.attr({
      difficulty: spawner.difficulty,
      x: position.x - spawn.w / 2,
      y: position.y - spawn.h / 2,
      z: spawner.z,
      autoRotate,
      angle: settings.angle,
      steering: 0,
      rotation: autoRotate ? settings.angle : 0
    });
    if (itemDef.attached) {
      spawner.attach(spawn);
    }

    if (typeof settings.spawnPosition === "object") {
      spawn.attr({
        x: position.x - spawn._origin.x,
        y: position.y - spawn._origin.y
      });
    }
    spawn.bullet(definition, settings, target);
  });
};

const Weapon = "Weapon";

Crafty.c(Weapon, {
  weapon(definition) {
    this.definition = definition;
    this.active = false;
    return this;
  },

  activate() {
    this.active = true;
    this.activatedAt = new Date() * 1;

    this.initialDelay = adjustForDifficulty(
      this.difficulty,
      this.definition.pattern.spawnRhythm.initialDelay
    );
    this.uniqueBind("EnterFrame", this._updateSpawnFrame);
    return this;
  },

  deactivate() {
    this.active = false;
    this.unbind("EnterFrame", this._updateSpawnFrame);
    return this;
  },

  _weaponSpawn(spawnRhythm) {
    spawnRhythm.spawns.forEach(([name, overrideSettings]) => {
      spawnItem(
        this.definition.pattern,
        name,
        overrideSettings,
        this,
        {
          x: this.x + (this.definition.x || 0),
          y: this.y + (this.definition.y || 0),
          angle: this.definition.angle || 0
        },
        this.definition.target
      );
    });
  },

  _updateSpawnFrame({ dt }) {
    const spawnRhythm = this.definition.pattern.spawnRhythm;

    if (this.initialDelay > 0) {
      this.initialDelay -= dt;
      if (this.initialDelay <= 0) {
        this._weaponSpawn(spawnRhythm);
        this.shotIndex = 0;
        this.shotDelay = adjustForDifficulty(
          this.difficulty,
          spawnRhythm.shotDelay
        );
      }
      return;
    }
    this.shotDelay -= dt;
    if (this.shotDelay <= 0) {
      this.shotIndex++;
      if (
        this.shotIndex >=
        adjustForDifficulty(this.difficulty, spawnRhythm.burst)
      ) {
        this.initialDelay = adjustForDifficulty(
          this.difficulty,
          spawnRhythm.burstDelay
        );
      } else {
        this._weaponSpawn(spawnRhythm);
        this.shotDelay = adjustForDifficulty(
          this.difficulty,
          spawnRhythm.shotDelay
        );
      }
    }
  }
});

export default Weapon;
