import compositions from "src/data/compositions";
import Composable from "src/components/Composable";

const adjustForDifficulty = (difficulty, numberOrArray) =>
  typeof numberOrArray === "number"
    ? numberOrArray
    : numberOrArray[0] + (numberOrArray[1] - numberOrArray[0]) * difficulty;

const Bullet = "Bullet";

Crafty.c(Bullet, {
  required: "2D, Motion, WebGL",

  bullet(weaponDefinition) {
    if (weaponDefinition.sprite) {
      this.addComponent(weaponDefinition.sprite);
    }
    if (weaponDefinition.composition) {
      this.addComponent(Composable).compose(
        compositions[weaponDefinition.composition]
      );
    }
    const speed = adjustForDifficulty(this.difficulty, weaponDefinition.speed);
    this.attr({ vx: speed * -1 });
    // add lifecycle stuff, bullet entity pools, etc.
  }
});

const Weapon = "Weapon";

Crafty.c(Weapon, {
  weapon(definition, activate = true) {
    this.weaponDefinition = definition;

    if (activate) {
      this.activatedAt = new Date() * 1;
      this.weaponInitialDelay = adjustForDifficulty(
        this.difficulty,
        this.weaponDefinition.spawnRythm.initialDelay
      );

      this.bind("EnterFrame", this._updateWeaponFrame);
    }
    return this;
  },

  _fireWeapon() {
    Crafty.e(Bullet)
      .attr({
        x: this.x,
        y: this.y,
        difficulty: this.difficulty
      })
      .bullet(this.weaponDefinition);
  },

  _updateWeaponFrame({ dt }) {
    const spawnRythm = this.weaponDefinition.spawnRythm;

    if (this.weaponInitialDelay > 0) {
      this.weaponInitialDelay -= dt;
      if (this.weaponInitialDelay <= 0) {
        this._fireWeapon();
        this.weaponWaitIndex = 0;
        this.weaponPatternDelay = adjustForDifficulty(
          this.difficulty,
          spawnRythm.repeat[this.weaponWaitIndex]
        );
      }
      return;
    }
    this.weaponPatternDelay -= dt;
    if (this.weaponPatternDelay <= 0) {
      this._fireWeapon();
      this.weaponWaitIndex =
        (this.weaponWaitIndex + 1) % spawnRythm.repeat.length;
      this.weaponPatternDelay = adjustForDifficulty(
        this.difficulty,
        spawnRythm.repeat[this.weaponWaitIndex]
      );
    }
  }
});

export default Weapon;
