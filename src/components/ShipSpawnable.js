import { setGameSpeed } from "src/lib/core/gameSpeed";
import Listener from "src/components/generic/Listener";

Crafty.c("ShipSpawnable", {
  init() {
    this.requires(Listener);
    this.bind("Activated", this.spawnShip);
  },

  remove() {
    this.unbind("Activated", this.spawnShip);
  },

  spawnPosition(spawnPosition) {
    this.spawnPosition = spawnPosition;
    if (this.spawnPosition == null) {
      this.spawnPosition = () => ({
        x: this.x,
        y: this.y
      });
    }
    return this;
  },

  spawnShip(stats = {}) {
    if (!this.has("ControlScheme")) {
      return;
    }
    if (!(this.lives > 0)) {
      return;
    }

    let pos = this.spawnPosition();
    if (pos.x < 10) {
      pos.x = 10;
    }
    if (this.ship != null) {
      pos = {
        x: this.ship.x,
        y: this.ship.y
      };
      this.ship.destroy();
      this.ship = null;
    }

    const { shipType } = this; //|| @level.getShipType()
    this.ship = Crafty.e(shipType).attr({
      x: pos.x,
      y: pos.y,
      z: this.z,
      playerNumber: this.playerNumber
    });

    this.ship.playerColor = this.color();
    if (typeof this.ship.colorOverride === "function") {
      this.ship.colorOverride(this.color(), "partial");
    } //if @has('ColorEffects')
    if (this.has("Color")) {
      if (typeof this.ship.color === "function") {
        this.ship.color(this.color());
      }
    }
    this.ship.attr({ healthPerc: this.health / this.maxHealth });

    if (this.has("ControlScheme")) {
      this.assignControls(this.ship);
    }

    this.listenTo(this.ship, "HitTarget", function(data) {
      this.stats.shotsHit += 1;
      const points = data.pointsOnHit != null ? data.pointsOnHit : 0;
      if (data != null) {
        this.addPoints(points, data.location);
      }
    });

    this.listenTo(this.ship, "DestroyTarget", function(data) {
      this.stats.enemiesKilled += 1;
      const points =
        (data.pointsOnDestroy != null ? data.pointsOnDestroy : 0) +
        (data.pointsOnHit != null ? data.pointsOnHit : 0);
      if (data != null) {
        this.addPoints(points, data.location);
      }
      if (data.chainable) {
        this.addChainXP(points);
      }
    });

    this.listenTo(this.ship, "BonusPoints", function(data) {
      this.addPoints(data.points, data.location);
    });

    this.listenTo(this.ship, "PowerUp", function(powerUp) {
      if (["ship", "shipBoost", "shipUpgrade"].includes(powerUp.type)) {
        if (powerUp.contains === "life") {
          this.gainLife();
        }
        if (powerUp.contains === "healthu") {
          this.healthUpgrade();
        }
        if (powerUp.contains === "healthb") {
          this.healthBoost();
        }
        if (powerUp.contains === "points") {
          this.addPoints(500);
        }
      }
      this.addPoints(20);
      this.ship.attr({ healthPerc: this.health / this.maxHealth });
    });

    this.listenTo(this.ship, "Shoot", function() {
      this.stats.shotsFired += 1;
    });

    this.trigger("ShipSpawned", this.ship);
    Crafty.trigger("ShipSpawned", this.ship);

    this.ship.stats(stats);
    // We start it after the spawned event, so that listeners can
    // reposition it before
    this.ship.start();
    this.listenTo(this.ship, "Hit", function(d) {
      this.loseHealth(d.damage);
      this.ship.attr({ healthPerc: this.health / this.maxHealth });

      if (this.health < 0) {
        this.ship.trigger("Die");
      }
    });

    this.listenTo(this.ship, "Destroyed", function() {
      this.ship.destroy();
      stats = this.ship.stats();
      this.ship = null;
      setGameSpeed(0.3);
      Crafty.e("Delay, TimeManager")
        .delay(() => setGameSpeed(0.2), 500, 0)
        .delay(() => setGameSpeed(0.4), 1000, 0)
        .delay(() => setGameSpeed(0.7), 1400, 0)
        .delay(
          () => {
            this.loseLife();
            setGameSpeed(1.0);
            this.spawnShip(stats);
          },
          1800,
          0,
          function() {
            this.destroy();
          }
        );
    });
    return this;
  }
});
