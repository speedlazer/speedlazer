import compositions from "src/data/compositions";
import Composable from "src/components/Composable";

const adjustForDifficulty = (difficulty, numberOrArray) =>
  typeof numberOrArray === "number"
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
  required: "2D, Motion, WebGL",

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

  bullet(weaponDefinition, itemSettings, overrideSettings, startAngle) {
    this.weaponDefinition = weaponDefinition;
    this.bulletSettings = itemSettings;

    const speed = adjustForDifficulty(this.difficulty, itemSettings.speed);
    this.attr({
      vy: -Math.sin((startAngle / 180) * Math.PI) * speed,
      vx: -Math.cos((startAngle / 180) * Math.PI) * speed
    });

    // add lifecycle stuff, bullet entity pools, etc.
    this.bulletTime = 0;
    this.bulletDefinition = itemSettings;
    this.maxBulletTime = itemSettings.timeline.reduce(
      (max, item) => (max > item.end ? max : item.end),
      0
    );

    this.uniqueBind("EnterFrame", this._updateBullet);
  },

  _updateBullet({ dt }) {
    this.bulletTime += dt;

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
  if (typeof itemDef.spawnPosition === "object") {
    spawn.attr({
      x: position.x - spawn._origin.x,
      y: position.y - spawn._origin.y,
      z: spawner.z,
      rotation: position.angle
    });
  }
  if (typeof itemDef.spawnPosition === "string") {
    spawn.attr({
      x: position.x - spawn.w / 2,
      y: position.y - spawn.h / 2,
      z: spawner.z,
      rotation: position.angle
    });
  }

  spawn.bullet(definition, itemDef, itemSettings, position.angle);
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
    weapon.nactive = true;
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
          w.waitIndex = 0;
          w.patternDelay = adjustForDifficulty(
            this.difficulty,
            spawnRhythm.repeat[w.waitIndex]
          );
        }
        return;
      }
      w.patternDelay -= dt;
      if (w.patternDelay <= 0) {
        this._weaponSpawn(w);
        w.waitIndex = (w.waitIndex + 1) % spawnRhythm.repeat.length;
        w.patternDelay = adjustForDifficulty(
          this.difficulty,
          spawnRhythm.repeat[w.waitIndex]
        );
      }
    });
  }
});

export default Weapon;
