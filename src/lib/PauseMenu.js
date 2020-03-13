/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { togglePause } from "src/lib/core/pauseToggle";

// Crude extraction of logic. It needs more refactoring,
// and could be extracted more to a generic Menu class
class PauseMenu {
  constructor() {
    this._handleUp = this._handleUp.bind(this);
    this._handleDown = this._handleDown.bind(this);
    this._handleFire = this._handleFire.bind(this);
    Crafty.bind("GamePause", state => {
      if (state) {
        this.createMenu();
        return this.showPlayers();
      } else {
        return this.remove();
      }
    });
  }

  createMenu() {
    return this._buildMenu([
      {
        text: "Resume",
        execute() {
          return togglePause();
        }
      },
      {
        text() {
          if (Crafty.audio.muted) {
            return "Sound [off]";
          } else {
            return "Sound [on]";
          }
        },
        execute() {
          Crafty.audio.toggleMute();
          return Game.changeSettings({ sound: !Crafty.audio.muted });
        }
      },
      {
        text: "Restart",
        execute() {
          togglePause();
          Crafty("Player").each(function() {
            return this.softReset();
          });
          return Crafty.enterScene("Game");
        }
      },
      {
        text: "Quit",
        execute() {
          togglePause();
          Crafty("Player").each(function() {
            return this.reset();
          });
          return Crafty.enterScene("Intro");
        }
      }
    ]);
  }

  _buildMenu(options) {
    this.options = options;
    const menu = Crafty.e("2D, UILayerDOM, Color, PauseMenu")
      .attr({
        x: 0.35 * Crafty.viewport.width,
        y: Crafty.viewport.height * 0.3,
        w: 0.3 * Crafty.viewport.width,
        h: (this.options.length + 2) * 32,
        z: 100,
        alpha: 0.5
      })
      .color("#000000");

    const title = Crafty.e("2D, UILayerDOM, Text")
      .attr({
        x: menu.x,
        y: menu.y + 20,
        w: menu.w,
        z: 110
      })
      .text("Game Paused")
      .textColor("#D0D0D0")
      .textAlign("center")
      .textFont({
        size: "15px",
        weight: "bold",
        family: "Press Start 2P"
      });
    menu.attach(title);

    for (let i = 0; i < this.options.length; i++) {
      var left;
      const o = this.options[i];
      const menuItem = Crafty.e("2D, UILayerDOM, Text")
        .attr({
          x: menu.x + 60,
          y: menu.y + 50 + 35 * i,
          w: menu.w - 60,
          z: 110
        })
        .text(
          (left = typeof o.text === "function" ? o.text() : undefined) != null
            ? left
            : o.text
        )
        .textColor("#D0D0D0")
        .textAlign("left")
        .textFont({
          size: "15px",
          weight: "bold",
          family: "Press Start 2P"
        });
      menu.attach(menuItem);
      o.entity = menuItem;
    }

    this.selected = 0;

    this.selectionChar = Crafty.e("2D, UILayerDOM, Text")
      .attr({
        x: menu.x + 20,
        w: 40,
        z: 110
      })
      .text(">")
      .textColor("#0000FF")
      .textAlign("left")
      .textFont({
        size: "15px",
        weight: "bold",
        family: "Press Start 2P"
      });
    menu.attach(this.selectionChar);
    this.updateSelection();

    const self = this;
    return Crafty("Player").each(function() {
      this.bind("Up", self._handleUp);
      this.bind("Down", self._handleDown);
      return this.bind("Fire", self._handleFire);
    });
  }

  _handleUp() {
    this.selected =
      (this.options.length + this.selected - 1) % this.options.length;
    return this.updateSelection();
  }

  _handleDown() {
    this.selected =
      (this.options.length + this.selected + 1) % this.options.length;
    return this.updateSelection();
  }

  updateSelection() {
    return this.selectionChar.attr({
      y: this.options[this.selected].entity.y
    });
  }

  _handleFire() {
    return setTimeout(() => {
      let left;
      const selected = this.options[this.selected];
      selected.execute();
      return selected.entity.text(
        (left =
          typeof selected.text === "function" ? selected.text() : undefined) !=
          null
          ? left
          : selected.text
      );
    });
  }

  showPlayers() {
    return Crafty("Player").each(function() {
      if (!this.ship) {
        return;
      }
      let xOff = 0.05;
      if (this.playerNumber === 2) {
        xOff = 0.7;
      }

      const statList = [
        `Score: ${this.points}`,
        `Lives: ${this.lives - 1}`,
        "",
        `&nbsp;&nbsp; Speed: &nbsp;&nbsp;&nbsp;&nbsp;+${this.ship.primaryWeapon.stats.speed}`,
        `&nbsp;&nbsp; RapidFire: +${this.ship.primaryWeapon.stats.rapid}`,
        `&nbsp;&nbsp; AimAssist: +${this.ship.primaryWeapon.stats.aim}`,
        `&nbsp;&nbsp; Damage: &nbsp;&nbsp;&nbsp;+${this.ship.primaryWeapon.stats.damage}`
      ];
      const stats = Crafty.e("2D, WebGL, Color, PauseMenu")
        .attr({
          x: xOff * Crafty.viewport.width,
          y: Crafty.viewport.height * 0.3,
          w: 0.25 * Crafty.viewport.width,
          h: (statList.length + 5) * 20,
          z: 100,
          alpha: 0.3
        })
        .color("#000");
      return (() => {
        const result = [];
        for (let i = 0; i < statList.length; i++) {
          const o = statList[i];
          const stat = Crafty.e("2D, UILayerDOM, Text")
            .attr({
              x: stats.x + 20,
              y: stats.y + 85 + 20 * i,
              w: stats.w - 60,
              z: 110
            })
            .text(o)
            .textColor("#D0D0D0")
            .textAlign("left")
            .textFont({
              size: "8px",
              weight: "bold",
              family: "Press Start 2P"
            });
          stats.attach(stat);
          if (2 < i && i < 7) {
            const s = [
              "speedBoost",
              "rapidFireBoost",
              "aimBoost",
              "damageBoost"
            ];
            const icon = Crafty.e("2D, WebGL, ColorEffects, PauseMenu")
              .addComponent(s[i - 3])
              .attr({
                x: stats.x + 20,
                y: stats.y + 82 + 20 * i,
                w: 12,
                h: 12,
                z: 110
              })
              .colorOverride("white", "partial");
            result.push(stats.attach(icon));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    });
  }

  remove() {
    const self = this;

    Crafty("Player").each(function() {
      this.unbind("Up", self._handleUp);
      this.unbind("Down", self._handleDown);
      return this.unbind("Fire", self._handleFire);
    });

    return Crafty("PauseMenu").each(function() {
      return this.destroy();
    });
  }
}

export default PauseMenu;
