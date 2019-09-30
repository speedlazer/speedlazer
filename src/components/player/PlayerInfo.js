import { levelProgress, levelInfo, determineLevel } from "src/lib/chainLevel";
import Listener from "src/components/generic/Listener";
import ControlScheme from "src/components/player/ControlScheme";

const PlayerInfo = "PlayerInfo";

Crafty.c(PlayerInfo, {
  init() {
    this.requires(["2D", Listener].join(", "));
    this.boosts = {};
    this.visible = true;
  },

  playerInfo(x, player) {
    this.player = player;
    this.displayedScore = player.points;
    this.displayedChain = player.chain;
    this.score = Crafty.e("2D, Text, UILayerDOM")
      .attr({
        w: 220,
        h: 20,
        x: x + 200,
        y: 10,
        z: 200
      })
      .textFont({
        size: "10px",
        family: "Press Start 2P"
      });
    if (this.player.has("Color")) {
      this.score.textColor(this.player.color());
    }

    this.lives = Crafty.e("2D, Text, UILayerDOM")
      .attr({
        w: 220,
        h: 20,
        x,
        y: 10,
        z: 200
      })
      .textFont({
        size: "10px",
        family: "Press Start 2P"
      });
    this.health = Crafty.e("2D, Text, UILayerDOM")
      .attr({
        w: 220,
        h: 20,
        x: x + 70,
        y: 8,
        z: 200
      })
      .textFont({
        size: "10px",
        family: "Press Start 2P"
      });
    this.heart = Crafty.e("2D, ColorEffects, heart, UILayerWebGL")
      .attr({
        w: 16,
        h: 16,
        x: x - 2,
        y: 6,
        z: 200
      })
      .colorOverride(player.color(), "partial");

    this.chain = Crafty.e("2D, Color, UILayerWebGL")
      .attr({
        w: 190,
        h: 2,
        x,
        y: 28,
        z: 200,
        alpha: 0.2
      })
      .color("#000000");

    this.chainName = Crafty.e("2D, Text, UILayerDOM")
      .attr({
        w: 220,
        h: 20,
        x,
        y: 34,
        z: 200
      })
      .textFont({
        size: "8px",
        family: "Press Start 2P"
      });
    if (this.player.has("Color")) {
      this.chainName.textColor(this.player.color());
    }

    this.chainProgress = Crafty.e("2D, Color, UILayerWebGL")
      .attr({
        w: 0,
        h: 2,
        x,
        y: 28,
        z: 200
      })
      .color(this.player.color());

    if (this.player.has("Color")) {
      this.lives.textColor(player.color());
      this.health.textColor(player.color());
    }

    this.updatePlayerInfo();
    this.createBoostsVisuals(x);

    this.listenTo(player, "GameLoop", fd => {
      this.updatePlayerInfo();
      this.updateBoostInfo();
      this.updateHealthInfo(fd);
    });
    return this;
  },

  setVisibility(visibility) {
    this.visible = visibility;
  },

  createBoostsVisuals(x) {
    const playerColor = this.player.color();
    this.boosts["speedb"] = Crafty.e(
      "2D, UILayerWebGL, speedBoost, ColorEffects"
    )
      .attr({ w: 16, h: 16 })
      .attr({ x, y: 25, z: 200 })
      .colorOverride(playerColor, "partial");
    this.boosts["rapidb"] = Crafty.e(
      "2D, UILayerWebGL, rapidFireBoost, ColorEffects"
    )
      .attr({ w: 16, h: 16 })
      .attr({ x: x + 20, y: 24, z: 200 })
      .colorOverride(playerColor, "partial");
    this.boosts["aimb"] = Crafty.e("2D, UILayerWebGL, aimBoost, ColorEffects")
      .attr({ w: 16, h: 16 })
      .attr({ x: x + 40, y: 24, z: 200 })
      .colorOverride(playerColor, "partial");
    this.boosts["damageb"] = Crafty.e(
      "2D, UILayerWebGL, damageBoost, ColorEffects"
    )
      .attr({ w: 16, h: 16 })
      .attr({ x: x + 50, y: 24, z: 200 })
      .colorOverride(playerColor, "partial");
  },

  updateBoostInfo() {
    this.boosts.forEach(b => b.attr({ alpha: 0 }));
    if (!this.player.has(ControlScheme)) {
      return;
    }
    if (this.visibile === false) {
      return;
    }
    if (this.player.ship != null) {
      const stats = this.player.ship.stats();
      Object.entries(stats.primary.boostTimings).forEach(([boost, timing]) => {
        const alpha =
          timing < 2000 && Math.floor(timing / 200) % 2 === 0 ? 0 : 1;
        this.boosts[boost].attr({ alpha });
      });
    }
  },

  updateHealthInfo(fd) {
    this.health.attr({ alpha: 0 });
    if (!this.player.has(ControlScheme)) {
      return;
    }
    if (this.visibile === false) {
      return;
    }
    if (this.player.ship != null) {
      let alpha = 1;
      if (this.player.health < 1) {
        if (Math.floor(fd.inGameTime / 200) % 2 === 0) {
          alpha = 0;
        }
      }
      this.health.attr({ alpha });
    }
  },

  updatePlayerInfo() {
    let health, text;
    if (this.displayedScore < this.player.points) {
      if (this.player.points - this.displayedScore > 1000) {
        this.displayedScore += 24;
      }
      if (this.player.points - this.displayedScore > 100) {
        this.displayedScore += 8;
      }
      if (this.player.points - this.displayedScore > 50) {
        this.displayedScore += 4;
      }

      this.displayedScore += 1;
    }

    if (this.displayedChain !== this.player.chain) {
      const lvl = determineLevel(this.player.chain);
      this.chainProgress.attr({ w: 190 * levelProgress(this.player.chain) });
      if (lvl === 0) {
        this.chainName.text("");
      } else {
        const info = levelInfo(lvl);
        this.chainName.text(info.name);
      }
      this.displayedChain = this.player.chain;
    }

    if (this.player.has(ControlScheme)) {
      this.score.text(`Score: ${this.displayedScore}`);
    } else {
      this.score.text(this.player.name);
    }

    if (this.player.has(ControlScheme)) {
      if (this.player.lives === 0) {
        this.lives.text("Game Over");
        this.heart.attr({ alpha: 0, visible: false });
        this.health.attr({ alpha: 0, visible: false });
        // TODO: Add continue? with time counter
      } else {
        if (this.visibile === true) {
          this.heart.attr({ alpha: 1 });
        }
        this.heart.attr({ visible: true });
        text = this.player.lives - 1;
        if (text === Infinity) {
          text = "Demo mode";
        }
        this.lives.text(`&nbsp;  ${text}`);

        health = Array(Math.max(1, this.player.health))
          .fill("▩")
          .join("");
        if (this.visibile === true) {
          this.health.attr({ alpha: 1 });
        }
        this.health.text(health);
      }
    } else {
      this.lives.text("Press fire to start!");
      this.heart.attr({ alpha: 0, visible: false });
      this.health.attr({ alpha: 0, visible: false });
      this.boosts.forEach(b => b.attr({ alpha: 0 }));
    }
  }
});

export default PlayerInfo;
