import defaults from "lodash/defaults";
import Acceleration from "src/components/generic/Acceleration";
import ColorEffects from "src/components/ColorEffects";
import Listener from "src/components/generic/Listener";

Crafty.c("ScreenBound", {
  required: "2D",

  init() {
    this.bind("UpdateFrame", this._checkBounds);
  },

  _checkBounds() {
    const maxX =
      -Crafty.viewport._x +
      Crafty.viewport._width / Crafty.viewport._scale +
      10;
    const minX = -Crafty.viewport._x - 100;

    const maxY =
      -Crafty.viewport._y +
      Crafty.viewport._height / Crafty.viewport._scale +
      10;
    const minY = -Crafty.viewport._y - 100;

    if (this.x > maxX || minX > this.x || minY > this.y || this.y > maxY) {
      // TODO: Turn this into a bullet pool
      this.destroy();
    }
  }
});

Crafty.c("BlasterBullet", {
  required: "ScreenBound, WebGL, Motion, sphere1, ColorEffects",

  init() {
    this.crop(4, 19, 24, 11);
  }
});

Crafty.c("Bomb", {
  required: "ScreenBound, WebGL, Motion, standardMine"
});

const blasterBullet = (color, angle, v) => {
  const vy = v * Math.sin((angle / 180) * Math.PI);
  const vx = v * Math.cos((angle / 180) * Math.PI);

  return Crafty.e("BlasterBullet")
    .attr({
      w: 40,
      h: 5,
      vx,
      vy,
      rotation: angle
    })
    .colorOverride(color);
};

const dropBomb = () =>
  Crafty.e("Bomb").attr({
    vy: 100,
    ay: 300,
    vx: 400,
    ax: -150
  });

class WeaponBlaster {
  constructor(ship) {
    this.ship = ship;
    this.cooldown = 0;
  }
  press() {
    if (!this.color) {
      this.color = {};
      Crafty.assignColor(this.ship.playerColor, this.color);
      Object.entries(this.color).forEach(([key, v]) => {
        this.color[key] = (v + 510) / 3;
      });
    }
  }
  hold(dt) {
    if (this.cooldown <= 0) {
      const bullet = blasterBullet(this.color, 0, 800);
      bullet.attr({
        x: this.ship.x + this.ship.w,
        y: this.ship.y + this.ship.h / 2
      });

      this.cooldown = 100;
    } else {
      this.cooldown -= dt;
    }
  }
  release() {}
}

class WeaponBomb {
  constructor(ship) {
    this.ship = ship;
    this.cooldown = 0;
  }
  press() {}
  hold(dt) {
    if (this.cooldown <= 0) {
      const bomb = dropBomb();
      bomb.attr({
        x: this.ship.x + this.ship.w / 2,
        y: this.ship.y + this.ship.h
      });

      this.cooldown = 500;
    } else {
      this.cooldown -= dt;
    }
  }
  release() {
    this.cooldown -= 400;
  }
}

class WeaponTimeBomb {
  constructor(ship) {
    this.ship = ship;
    this.cooldown = 0;
  }
  press() {}
  hold(dt) {
    if (this.cooldown <= 0) {
      const bomb = dropBomb();
      bomb.attr({
        x: this.ship.x + this.ship.w / 2,
        y: this.ship.y + this.ship.h
      });

      this.cooldown = 500;
    } else {
      this.cooldown -= dt;
    }
  }
  release() {
    this.cooldown -= 400;
  }
}

class WeaponChargedBlaster {
  constructor(ship) {
    this.ship = ship;
    this.charged = 0;
  }
  press() {
    this.charged = 0;
    if (!this.color) {
      this.color = {};
      Crafty.assignColor(this.ship.playerColor, this.color);
      Object.entries(this.color).forEach(([key, v]) => {
        this.color[key] = (v + 510) / 3;
      });
    }
  }
  hold(dt) {
    this.charged += dt;
    if (this.charged > 3000) {
      this.ship.colorOverride({ _red: 255, _green: 0, _blue: 0 });
    }
    if (this.charged > 5000) {
      this.ship.destroy();
    }
  }
  release() {
    this.ship.colorOverride(this.ship.playerColor, "partial");
    let bullets = this.charged / 100;
    while (bullets > 0) {
      const angle = -80 + Math.random() * 160;
      const v = 250 + Math.random() * 200;

      const bullet = blasterBullet(this.color, angle, v);
      bullet.attr({
        x: this.ship.x + this.ship.w,
        y: this.ship.y + this.ship.h / 2
      });
      bullets--;
    }
    this.charged = 0;
  }
}

const PlayerSpaceship = "PlayerSpaceship";

Crafty.c(PlayerSpaceship, {
  required: [
    "2D, WebGL, playerShip",
    ColorEffects,
    Listener,
    "Collision, SunBlock, PlayerControlledShip",
    Acceleration
  ].join(","),

  init() {
    this.attr({ w: 71, h: 45 });
    this.collision([21, 13, 56, 13, 66, 32, 35, 32]);

    this.currentRenderedSpeed = 0;
    this.flip("X");

    this.weapons = [
      {
        primary: new WeaponBlaster(this),
        secondary: new WeaponChargedBlaster(this)
      },
      {
        primary: new WeaponBomb(this),
        secondary: new WeaponTimeBomb(this)
      }
    ];
    this.activeWeapon = 0;
  },

  updateMovementVisuals(rotation, dx, dy, dt) {
    if (rotation == null) {
      rotation = 0;
    }
    const velocity = Math.max(dx * (1000 / dt), 0);

    if (dy > 0) {
      this.healthPerc < 0.3 ? this.sprite(13, 53) : this.sprite(7, 52);
    } else if (dy < 0) {
      this.healthPerc < 0.3 ? this.sprite(13, 51) : this.sprite(10, 52);
    } else {
      this.healthPerc < 0.3 ? this.sprite(0, 50) : this.sprite(0, 48);
    }

    this.rotation = 0;
    this._updateFlyingSpeed(velocity);
    this.rotation = rotation;
  },

  _updateFlyingSpeed(newSpeed) {
    const correction =
      newSpeed < 30 ? newSpeed / 2 : 15 + (newSpeed / 400) * 100;

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
  },

  start() {
    this.backFire = Crafty.e(
      ["2D, WebGL, shipEngineFire", ColorEffects, "SpriteAnimation"].join(", ")
    );
    this.backFire.reel("burn", 300, [
      [4, 53, 3, 1],
      [3, 48, 3, 1]
    ]);
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

    ["_red", "_green", "_blue"].forEach(comp => {
      const newC = (c[comp] + basicC[comp] + basicC[comp]) / 3;
      c[comp] = newC;
    });

    this.trailColor = c;
    this.backFire.colorOverride(c);

    this.addComponent("Invincible").invincibleDuration(1500);

    this.bind("GameLoop", function(fd) {
      const motionX = ((this.vx + this._currentSpeed.x) / 1000.0) * fd.dt;
      const motionY = ((this.vy + this._currentSpeed.y) / 1000.0) * fd.dt;

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

  controlPrimary(onOff) {
    if (onOff) {
      this.controlSecondary(false);
      this._primaryWeapon().press();
      this.bind("EnterFrame", this._holdPrimary);
    } else {
      this.unbind("EnterFrame", this._holdPrimary);
      this._primaryWeapon().release();
    }
  },

  _holdPrimary({ dt }) {
    this._primaryWeapon().hold(dt);
  },

  controlSwitch(onOff) {
    if (!onOff) {
      this.activeWeapon = (this.activeWeapon + 1) % this.weapons.length;
    }
  },

  controlSecondary(onOff) {
    if (onOff) {
      this.controlPrimary(false);
      this._secondaryWeapon().press();
      this.bind("EnterFrame", this._holdSecondary);
    } else {
      this.unbind("EnterFrame", this._holdSecondary);
      this._secondaryWeapon().release();
    }
  },

  _holdSecondary({ dt }) {
    this._secondaryWeapon().hold(dt);
  },

  _primaryWeapon() {
    return this.weapons[this.activeWeapon].primary;
  },

  _secondaryWeapon() {
    return this.weapons[this.activeWeapon].secondary;
  },

  controlBlock(onOff) {
    if (onOff) {
      this.activeShield = Crafty.e("2D, WebGL, shield").attr({
        x: this.x - 32,
        y: this.y - 40
      });
      this.attach(this.activeShield);
    } else {
      this.activeShield.destroy();
    }
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
  }
});

export default PlayerSpaceship;
