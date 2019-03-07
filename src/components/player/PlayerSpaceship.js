import defaults from "lodash/defaults";
import createEntityPool from "src/lib/entityPool";
import { isPaused } from "src/lib/core/pauseToggle";
import { lookup } from "src/lib/random";

Crafty.c("PlayerSpaceship", {
  required:
    "2D, WebGL, playerShip, ColorEffects, Listener, Collision, SunBlock, " +
    "PlayerControlledShip, Acceleration, InventoryWeapons",

  init() {
    this.attr({ w: 71, h: 45 });
    this.collision([21, 13, 56, 13, 66, 32, 35, 32]);

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
          const d =
            typeof obj.choreographyDelta === "function"
              ? obj.choreographyDelta()
              : { x: 0, y: 0 };

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

      this.shift(xCorrection, yCorrection);
    });

    this.primaryWeapon = undefined;
    this.primaryWeapons = [];
    this.secondaryWeapon = undefined;
    this.superUsed = 0;
    this.weaponsEnabled = true;
    this.currentRenderedSpeed = 0;
    this.flip("X");
    this.emitCooldown = 0;
  },

  _squashShip() {
    this.trigger("Hit", { damage: 1000 });
  },

  updateMovementVisuals(rotation, dx, dy, dt) {
    if (rotation == null) {
      rotation = 0;
    }
    const velocity = Math.max(dx * (1000 / dt), 0);

    if (dy > 0) {
      this.healthPerc < 0.3 ? this.sprite(13, 5) : this.sprite(7, 4);
    } else if (dy < 0) {
      this.healthPerc < 0.3 ? this.sprite(13, 3) : this.sprite(10, 4);
    } else {
      this.healthPerc < 0.3 ? this.sprite(0, 2) : this.sprite(0, 0);
    }

    this.rotation = 0;
    this._updateFlyingSpeed(velocity, dt);
    this.rotation = rotation;
  },

  _updateFlyingSpeed(newSpeed, dt) {
    const correction = newSpeed < 30 ? newSpeed / 2 : 15 + newSpeed / 400 * 100;

    if (this.currentRenderedSpeed > correction) {
      this.currentRenderedSpeed -= 12;
    } else if (this.currentRenderedSpeed < correction) {
      this.currentRenderedSpeed += 12;
    }
    if (this.currentRenderedSpeed < 0) {
      this.currentRenderedSpeed = 0;
    }

    const w = 10 + this.currentRenderedSpeed;

    const h = Math.min(w / 3, 15);
    this.backFire.attr({
      x: this.x - w + 9,
      y: this.y + 20 - Math.floor(h / 2),
      w,
      h
    });
    this._emitTrail(dt);
  },

  _emitTrail(dt) {
    this.emitCooldown -= dt;
    if (this.emitCooldown < 0) {
      const w = this.backFire.w / 4;
      const h = 4;
      this.trailEntPool
        .get()
        .attr({
          x: this.x - w + 8,
          dy: 0,
          y: Math.floor(this.y + 21 - lookup() * 4),
          w,
          h,
          z: -4,
          alpha: 0.3 + lookup() * 0.4
        })
        .tweenPromise({ alpha: 0, h: 2, dy: 2 }, 750, "easeOutQuad")
        .then(e => {
          this.trailEntPool.recycle(e);
        });
      this.emitCooldown = 30;
    }
  },

  start() {
    this.backFire = Crafty.e(
      "2D, WebGL, shipEngineFire, ColorEffects, SpriteAnimation"
    );
    this.backFire.reel("burn", 300, [[4, 5, 3, 1], [3, 0, 3, 1]]);
    this.backFire.timing = 0;
    this.backFire.animate("burn", -1);
    const w = 68;
    const h = 10;

    this.backFire.attr({
      x: this.x - w,
      y: this.y + 20 - Math.floor(h / 2),
      w,
      h,
      alpha: 0.8,
      z: this.z - 1
    });
    this.attach(this.backFire);

    const c = {};
    const basicC = {
      _red: 255,
      _green: 255,
      _blue: 255
    };
    Crafty.assignColor(this.playerColor, c);
    for (let comp of ["_red", "_green", "_blue"]) {
      const newC = (c[comp] + basicC[comp] + basicC[comp]) / 3;
      c[comp] = newC;
    }

    this.trailColor = c;
    this.backFire.colorOverride(c);
    this.trailEntPool = createEntityPool(
      () =>
        Crafty.e(
          "2D, WebGL, shipEngineFire, Delta2D, TweenPromise, ViewportRelativeMotion, ColorEffects"
        )
          .colorOverride(this.trailColor)
          .viewportRelativeMotion({
            speed: 1
          }),
      2
    );

    this.addComponent("Invincible").invincibleDuration(1500);

    //this.setDetectionOffset(60);
    this.onHit("Hostile", collision => {
      if (isPaused() || this.has("Invincible")) return;
      let hit = false;
      let damage = 0;
      for (let e of collision) {
        if (e.obj.damage && e.obj.damage > damage && !e.obj.hidden) {
          ({ damage } = e.obj);
          hit = true;
        }
      }
      if (hit) {
        this.trigger("Hit", { damage });
      }
    });

    this.onHit("PowerUp", collision => {
      if (isPaused()) return;
      collision
        .filter(pu => !pu.obj.pickedUp)
        .forEach(pu => this.pickUp(pu.obj));
    });

    this.bind("Hit", () => {
      this.addComponent("Invincible").invincibleDuration(2000);
      Crafty.e("Blast, Explosion").explode({
        x: this.x + this.w / 2,
        y: this.y + this.h / 2,
        radius: this.w / 3
      });
      Crafty.audio.play("explosion");
      Crafty("ScrollWall")
        .get(0)
        .addTrauma(0.3);
    });

    this.bind("Die", () => {
      Crafty.e("Blast, Explosion").explode({
        x: this.x + this.w / 2,
        y: this.y + this.h / 2,
        radius: this.w
      });
      Crafty.audio.play("explosion");
      // this trauma is added upon the 'hit'
      Crafty("ScrollWall")
        .get(0)
        .addTrauma(0.3);
      this.trigger("Destroyed", this);
    });

    this.bind("CameraPan", ({ dx, dy }) => this.shift(-dx, -dy));

    this.bind("GameLoop", function(fd) {
      const motionX = (this.vx + this._currentSpeed.x) / 1000.0 * fd.dt;
      const motionY = (this.vy + this._currentSpeed.y) / 1000.0 * fd.dt;

      if (this.has("AnimationMode")) {
        if (this._choreography && this._choreography.length === 0) {
          this.updateMovementVisuals(this.rotation, motionX, motionY, fd.dt);
        }
        return;
      }

      this.updateAcceleration();

      const r = this.rotation;
      const newR = motionY;
      let nr = r;
      if (r < newR) {
        nr += 1;
      } else if (r > newR) {
        nr -= 1;
      }

      this.rotation = nr;
      this.updateMovementVisuals(this.rotation, motionX, motionY, fd.dt);
    });

    return this;
  },

  forcedSpeed(speed, options = {}) {
    this.targetSpeed(speed, options);
  },

  shoot(onOff) {
    if (!this.weaponsEnabled) {
      return;
    }

    if (this.primaryWeapon != null) {
      this.primaryWeapon.shoot(onOff);
    }

    if (this.secondaryWeapon != null) {
      this.secondaryWeapon.shoot(onOff);
    }
  },

  switchWeapon(onOff) {
    if (!onOff) {
      return;
    }
    const nextWeapon = (this.currentPrimary + 1) % this.primaryWeapons.length;
    if (this.primaryWeapon != null) {
      this.primaryWeapon.uninstall();
    }
    this.primaryWeapon = this.primaryWeapons[nextWeapon];
    this.primaryWeapon.install(this);
    this.currentPrimary = nextWeapon;
  },

  superWeapon(onOff) {
    if (!onOff) {
      return;
    }
    this.superUsed += 1;
  },

  pickUp(powerUp) {
    if (!this.installItem(powerUp.settings)) {
      return;
    }
    Crafty.audio.play("powerup");
    this.trigger("PowerUp", powerUp.settings);
    powerUp.pickup();
  },

  clearItems() {
    if (this.primaryWeapon != null) {
      this.primaryWeapon.uninstall();
    }
    this.primaryWeapons.forEach(w => w.destroy());
    this.primaryWeapons = [];
    this.items = [];
  },

  _installPrimary(componentName) {
    const text = {
      damage: "Damage",
      rapid: "RapidFire",
      aim: "AimAssist",
      speed: "BulletSpeed",

      damageb: "Damage",
      rapidb: "RapidFire",
      aimb: "AimAssist",
      speedb: "BulletSpeed"
    };
    const weapon = Crafty.e(componentName);
    weapon.install(this);
    if (this.primaryWeapon != null) {
      this.primaryWeapon.uninstall();
    }
    this.primaryWeapon = weapon;
    this.listenTo(weapon, "levelUp", info =>
      this.scoreText(`${text[info.aspect]} +${info.level}`)
    );
    this.listenTo(weapon, "boost", info =>
      this.scoreText(`${text[info.aspect]} Boost!`)
    );
    this.listenTo(weapon, "boostExpired", info =>
      this.scoreText(`${text[info.aspect]} Boost expired`, {
        positive: false
      })
    );

    this.primaryWeapons.push(weapon);
    this.currentPrimary = this.primaryWeapons.length - 1;
  },

  hasItem(item) {
    if (this.items == null) {
      return false;
    }
    return this.items.find(inventory => inventory.contains === item);
  },

  scoreText(text, settings = {}) {
    settings = defaults(settings, {
      positive: true,
      location: { x: this.x, y: this.y },
      attach: true,
      duration: 1000,
      distance: 70,
      delay: 400
    });

    let location =
      typeof settings.location === "function" ? settings.location() : undefined;
    if (location) {
      location = {
        x: location.x,
        y: location.y
      };
    }

    if (location == null) {
      ({ location } = settings);
    }

    const t = Crafty.e("Text, DOM, 2D, Tween, Delay")
      .textColor(settings.positive ? "#DDD" : "#F00")
      .text(text)
      .attr({
        x: location.x,
        y: location.y - 10,
        z: 990,
        w: 250,
        alpha: 0.75
      })
      .textFont({
        size: "10px",
        weight: "bold",
        family: "Press Start 2P"
      });
    if (settings.attach) {
      this.attach(t);
    }
    t.delay(() => {
      if (settings.attach) {
        this.detach(t);
      }
      t.tween(
        { rotation: 0, y: t.y - settings.distance, alpha: 0.5 },
        settings.duration,
        "easeInQuad"
      );
      t.one("TweenEnd", () => t.destroy());
    }, settings.delay);
  },

  remove() {
    this.trailEntPool.clean();
  }
});
