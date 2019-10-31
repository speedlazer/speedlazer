import compositions from "src/data/compositions";
import Composable from "src/components/Composable";

const adjustForDifficulty = (difficulty, numberOrArray) =>
  typeof numberOrArray === "number"
    ? numberOrArray
    : numberOrArray[0] + (numberOrArray[1] - numberOrArray[0]) * difficulty;

const Bullet = "Bullet";

Crafty.c(Bullet, {
  required: "2D, Motion, WebGL",

  bullet(weaponDefinition, itemSettings, overrideSettings) {
    const speed = adjustForDifficulty(this.difficulty, itemSettings.speed);
    this.attr({ vx: speed * -1 });
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
      this.freeze();
    }
  }
});

let pool = [];

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
    this.addComponent(itemDefinition.sprite);
  }
  if (itemDefinition.composition) {
    spawn
      .addComponent(Composable)
      .compose(compositions[itemDefinition.composition]);
  }
  pool = pool.concat(spawn);
  return spawn;
};

const spawnItem = (definition, itemName, itemSettings, spawner) => {
  const itemDef = definition.spawnables[itemName];

  const spawn = getItemFromPool(itemDef);
  spawn.attr({
    difficulty: spawner.difficulty,
    x:
      spawner.x +
      itemDef.spawnPosition[0] * spawner.w -
      spawn.w * (1 - itemDef.spawnPosition[0]),
    y:
      spawner.y +
      itemDef.spawnPosition[1] * spawner.h -
      spawn.h * (1 - itemDef.spawnPosition[1])
  });
  spawn.bullet(definition, itemDef, itemSettings);
};

const Weapon = "Weapon";

Crafty.c(Weapon, {
  weapon(definition, activate = true) {
    this.weaponDefinition = definition;

    if (activate) {
      this.activatedAt = new Date() * 1;
      this.weaponInitialDelay = adjustForDifficulty(
        this.difficulty,
        this.weaponDefinition.spawnRhythm.initialDelay
      );

      this.bind("EnterFrame", this._updateSpawnFrame);
    }
    return this;
  },

  _weaponSpawn() {
    this.weaponDefinition.spawns.forEach(([name, overrideSettings]) => {
      spawnItem(this.weaponDefinition, name, overrideSettings, this);
    });
  },

  _updateSpawnFrame({ dt }) {
    const spawnRhythm = this.weaponDefinition.spawnRhythm;

    if (this.weaponInitialDelay > 0) {
      this.weaponInitialDelay -= dt;
      if (this.weaponInitialDelay <= 0) {
        this._weaponSpawn();
        this.weaponWaitIndex = 0;
        this.weaponPatternDelay = adjustForDifficulty(
          this.difficulty,
          spawnRhythm.repeat[this.weaponWaitIndex]
        );
      }
      return;
    }
    this.weaponPatternDelay -= dt;
    if (this.weaponPatternDelay <= 0) {
      this._weaponSpawn();
      this.weaponWaitIndex =
        (this.weaponWaitIndex + 1) % spawnRhythm.repeat.length;
      this.weaponPatternDelay = adjustForDifficulty(
        this.difficulty,
        spawnRhythm.repeat[this.weaponWaitIndex]
      );
    }
  }
});

export default Weapon;
