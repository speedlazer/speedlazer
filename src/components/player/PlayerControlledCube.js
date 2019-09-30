import { isPaused } from "src/lib/core/pauseToggle";
import Acceleration from "src/components/generic/Acceleration";
import Listener from "src/components/generic/Listener";
import InventoryWeapons from "src/components/player/InventoryWeapons";

const PlayerControlledCube = "PlayerControlledCube";

Crafty.c(PlayerControlledCube, {
  init() {
    this.requires(
      [
        "2D, WebGL, Color",
        Listener,
        "Collision, SunBlock, PlayerControlledShip",
        InventoryWeapons,
        Acceleration
      ].join(", ")
    );
    this.attr({ w: 40, h: 40 });

    this.bind("Move", function() {
      if (this.hit("Edge") || this.hit("Solid")) {
        // Contain player within playfield
        const delta = this.motionDelta();
        this.shift(-delta.x, -delta.y);
      }
    });

    this.primaryWeapon = undefined;
    this.primaryWeapons = [];
    this.secondaryWeapon = undefined;
    this.superUsed = 0;
    this.weaponsEnabled = true;
    this.currentRenderedSpeed = 0;
  },

  start() {
    this.addComponent("Invincible").invincibleDuration(2000);

    this.onHit("Enemy", function(collision) {
      if (isPaused()) {
        return;
      }
      if (this.has("Invincible")) {
        return;
      }
      const hit = Array.from(collision).some(e => !e.obj.hidden);
      if (hit) {
        return this.trigger("Hit");
      }
    });

    this.onHit("PowerUp", function(e) {
      if (isPaused()) {
        return;
      }
      Array.from(e).forEach(pu => {
        this.pickup(pu.obj);
        this.trigger("PowerUp", pu.obj);
      });
    });

    this.bind("Hit", function() {
      return this.trigger("Destroyed", this);
    });

    this.bind("CameraPan", function({ dx, dy }) {
      return this.shift(-dx, -dy);
    });

    this.bind("GameLoop", function(fd) {
      const motionX = (this._currentSpeed.x / 1000.0) * fd.dt;
      const motionY = (this._currentSpeed.y / 1000.0) * fd.dt;
      this.updateAcceleration();

      //@x += motionX
      //@y += motionY
      //# Move player back if flying into an object
      if (this.hit("Edge") || this.hit("Solid")) {
        this.x -= motionX;
        this.y -= motionY;
      }

      // still hitting an object? then we where forced in
      // and are crashed (squashed probably)
      if (this.hit("Edge") || this.hit("Solid")) {
        return this.trigger("Hit");
      }
    });

    return this;
  },

  forcedSpeed(speed, options) {
    return this.targetSpeed(speed, options);
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
    if (this.installItem(powerUp.settings)) {
      this.trigger("PowerUp", powerUp.settings);
      powerUp.pickup();
    }
  },

  clearItems() {
    if (this.primaryWeapon != null) {
      this.primaryWeapon.uninstall();
    }
    this.primaryWeapon = null;
    this.primaryWeapons.forEach(w => w.destroy());
    this.primaryWeapons = [];
    this.items = [];
  },

  _installPrimary(componentName) {
    const weapon = Crafty.e(componentName);
    weapon.install(this);
    if (this.primaryWeapon != null) {
      this.primaryWeapon.uninstall();
    }
    this.primaryWeapon = weapon;
    this.listenTo(weapon, "levelUp", level => {
      this.scoreText(`L +${level}`);
    });
    this.primaryWeapons.push(weapon);
    this.currentPrimary = this.primaryWeapons.length - 1;
  },

  hasItem(item) {
    if (this.items == null) {
      this.items = [];
    }
    return ~this.items.indexOf(item);
  },

  scoreText(text) {
    return Crafty.e("Text, DOM, 2D, Tween")
      .textColor("#FFFFFF")
      .text(text)
      .attr({
        x: this.x,
        y: this.y - 10,
        z: 990,
        w: 100
      })
      .textFont({
        size: "10px",
        weight: "bold",
        family: "Press Start 2P"
      })
      .tween({ y: this.y - 40, alpha: 0.5 }, 1000)
      .one("TweenEnd", function() {
        return this.destroy();
      });
  }
});

export default PlayerControlledCube;
