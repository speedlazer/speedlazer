import defaults from "lodash/defaults";

Crafty.c("Drone", {
  required: "Enemy, standardDrone",

  drone(attr = {}) {
    this.attr(
      defaults(attr, {
        w: 40,
        h: 40,
        health: 100,
        defaultSpeed: 100,
        pointsOnHit: 10,
        pointsOnDestroy: 15,
        countAsEnemy: true
      })
    );
    this.origin("center");
    this.collision([2, 25, 8, 18, 20, 13, 30, 15, 33, 28, 14, 34, 4, 30]);
    this.attr({ weaponOrigin: [2, 25] });

    this.enemy();
    this.bind("Hit", data => {
      if (this.juice !== false) {
        this.shiftedX += 5;
      }
      if (this.juice !== false) {
        Crafty.audio.play("hit", 1, 0.5);
      }
      if (data.projectile.has("Bullet") && this.juice !== false) {
        return Crafty.e("Blast, LaserHit").explode({
          x: data.projectile.x,
          y: data.projectile.y,
          radius: 4,
          duration: 50
        });
      }
    });
    return this;
  },

  updatedHealth() {
    if (this.juice === false) {
      return;
    }
    if (this.health < 200) {
      return this.sprite(2, 4, 2, 2);
    }
    this.sprite(0, 4, 2, 2);
  },

  updateMovementVisuals(rotation, dx, dy, dt) {
    if (this.deathDecoy) {
      return;
    }
    this.vx = dx * (1000 / dt);
    this.vy = dy * (1000 / dt);

    dx > 0 ? this.flipX() : this.unflipX();
  }
});
