import { highscores } from "src/lib/highscores";
import Player from "src/components/player/Player";

Crafty.defineScene(
  "Intro",
  () => {
    // constructor
    Crafty.background("#000000");
    Crafty.viewport.x = 0;
    Crafty.viewport.y = 0;

    const w = Crafty.viewport.width;
    const h = Crafty.viewport.height;

    const offset = 0.15;

    Crafty.e("2D, DOM, Text, Tween, Delay")
      .attr({ x: w * (0.5 - offset), y: h * 0.4, w: 400 })
      .text("Speedlazer")
      .textColor("#0000ff")
      .textFont({
        size: "40px",
        weight: "bold",
        family: "Press Start 2P"
      })
      .delay(
        function() {
          this.tween({ x: w * (0.5 + offset) - 400 }, 2000);
          this.one("TweenEnd", function() {
            this.tween({ x: w * (0.5 - offset) }, 2000);
          });
        },
        4000,
        -1
      );

    Crafty.e("2D, DOM, Text, Tween, Delay")
      .attr({ x: w * 0.5 - 150, y: h * 0.6, w: 300 })
      .text("Press fire to start!")
      .textColor("#FF0000")
      .textFont({
        size: "15px",
        weight: "bold",
        family: "Press Start 2P"
      })
      .delay(
        function() {
          this.tween({ alpha: 0.5 }, 1000);
          this.one("TweenEnd", function() {
            this.tween({ alpha: 1 }, 1000);
          });
        },
        2000,
        -1
      );

    const entry = highscores()[0];

    Crafty.e("2D, DOM, Text")
      .attr({ x: 0, y: h * 0.85, w })
      .text(`HI SCORE: ${entry.score} ${entry.initials}`)
      .textColor("#FFFF00")
      .textAlign("center")
      .textFont({
        size: "10px",
        weight: "bold",
        family: "Press Start 2P"
      });

    const gamepadConnect = Crafty.e("2D, DOM, Text")
      .attr({ x: 0, y: h * 0.95, w })
      .text("")
      .textColor("#303030")
      .textAlign("center")
      .textFont({
        size: "10px",
        weight: "bold",
        family: "Press Start 2P"
      });

    window.addEventListener("gamepadconnected", () => {
      gamepadConnect.text(`Gamepad detected!`);
    });
    const pads = window.navigator.getGamepads();
    const hasGamePad = Array.from(pads).some(pad => pad && pad.connected);
    hasGamePad && gamepadConnect.text("Gamepad detected!");

    Crafty(Player).each(function() {
      this.reset();
      this.one("Activated", () => Crafty.enterScene("Game", {}));
    });

    Crafty.e("Delay").delay(() => Crafty.enterScene("Scores"), 20000);
  },

  () => {
    // destructor
    Crafty("Delay").each(function() {
      this.destroy();
    });
    Crafty(Player).each(function() {
      this.unbind("Activated");
    });
  }
);
