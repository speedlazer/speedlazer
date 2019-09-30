const EXTRA_LIFE_POINT_BOUNDARY = 15000;
import { determineLevel, levelInfo } from "src/lib/chainLevel";
import ControlScheme from "src/components/player/ControlScheme";

const Player = "Player";

Crafty.c(Player, {
  events: {
    EntityEndState: "_processEnemyState"
  },

  init() {
    this.reset();
  },

  reset() {
    this.softReset();
    if (this.has(ControlScheme)) {
      this.removeComponent(ControlScheme);
    }
  },

  softReset() {
    this.stats = {
      shotsFired: 0,
      shotsHit: 0,
      enemiesKilled: 0,
      bonus: 0
    };

    this.attr({
      lives: 3,
      health: 5,
      maxHealth: 5,
      points: 0,
      chain: 0
    });
  },

  loseHealth(damage) {
    this.health -= damage;
    this.trigger("UpdateHealth", { health: this.health });
  },

  loseLife() {
    if (!(this.lives > 0)) {
      return;
    }
    this.lives -= 1;
    this.health = this.maxHealth;
    this.chain = 0;
    this.trigger("UpdateLives", { lives: this.lives });

    if (this.lives <= 0) {
      Crafty.trigger("PlayerDied", this);
    }
  },

  gainLife() {
    this.lives += 1;
    this.trigger("UpdateLives", { lives: this.lives });
  },

  healthUpgrade() {
    this.maxHealth += 1;
    this.health = this.maxHealth;
    this.trigger("UpdateHealth", {
      maxHealth: this.maxHealth,
      health: this.health
    });
  },

  healthBoost() {
    this.health = this.maxHealth;
    this.trigger("UpdateHealth", { health: this.health });
  },

  eligibleForExtraLife() {
    if (!this.lastExtraLifeThreshold) {
      this.lastExtraLifeThreshold = 0;
    }
    if (
      this.points - this.lastExtraLifeThreshold >=
      EXTRA_LIFE_POINT_BOUNDARY
    ) {
      return true;
    }
  },

  rewardExtraLife() {
    this.lastExtraLifeThreshold = this.points;
  },

  addPoints(amount, location) {
    // Debatable should you get points for a target
    // that gets destroyed after you self died?
    if (!(this.lives > 0)) {
      return;
    }
    if (location && amount > 0) {
      this.ship.scoreText(`+${amount}`, {
        location,
        attach: false,
        duration: 200,
        distance: 30,
        delay: 10
      });
    }

    this.points += amount;
    this.trigger("UpdatePoints", { points: this.points });
  },

  addChainXP(amount) {
    const currentLevel = determineLevel(this.chain);
    this.chain += amount;
    const newLevel = determineLevel(this.chain);
    if (newLevel > currentLevel) {
      const levelData = levelInfo(newLevel);
      this.points += levelData.reward;
      this.trigger("UpdatePoints", { points: this.points });

      this.ship.scoreText(`${levelData.name}! +${levelData.reward}`, {
        attach: false,
        duration: 2000,
        distance: 30,
        delay: 40
      });
    }
  },

  _processEnemyState(enemy) {
    if (enemy.alive && enemy.chainable) {
      const currentLevel = determineLevel(this.chain);
      this.chain = 0;
      if (currentLevel > 0) {
        this.ship.scoreText("Chain lost!", {
          attach: false,
          positive: false,
          duration: 2000,
          distance: 30,
          delay: 40
        });
      }
    }
  }
});

export default Player;
