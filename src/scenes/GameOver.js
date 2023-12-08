import clone from "lodash/clone";
import sortBy from "lodash/sortBy";
import CryptoJS from "crypto-js";
import { highscores } from "../lib/highscores";
import Crafty from "../crafty";
import settings from "../settings.json";

Crafty.defineScene(
  "GameOver",
  async ({ gameCompleted = false, score = 0, checkpoint = null } = {}) => {
    // constructor
    Crafty.background("#000");
    Crafty.viewport.x = 0;
    Crafty.viewport.y = 0;

    const w = Crafty.viewport.width;
    const h = Crafty.viewport.height;
    const text = gameCompleted ? "Congratulations" : "Game Over";

    Crafty.e("2D, DOM, Text")
      .attr({ x: 0, y: h * 0.2, w })
      .text(text)
      .textColor("#FF0000")
      .textAlign("center")
      .textFont({
        size: "50px",
        weight: "bold",
        family: "Press Start 2P",
      });

    const collect = [];
    let hs = clone(highscores());

    const task = (data) => async () => {
      let s;
      let highScorePos = null;
      for (let i = 0; i < hs.length; i++) {
        s = hs[i];
        if (s.player === data.player) {
          highScorePos = i;
        }
      }

      let t = `${data.name}: ${data.points}`;
      if (highScorePos < 10) {
        const rank = (() => {
          switch (highScorePos) {
            case 0:
              return "ACE";
            case 1:
              return "2nd";
            case 2:
              return "3rd";
            default:
              return `${highScorePos + 1}th`;
          }
        })();
        t += ` - ${rank}`;
      }

      Crafty.e("2D, DOM, Text")
        .attr({ x: 0, y: h * 0.45 + data.index * 45, w })
        .text(t)
        .textColor(data.color)
        .textAlign("center")
        .textFont({
          size: "20px",
          weight: "bold",
          family: "Press Start 2P",
        });

      if (highScorePos >= 10) return;
      const p = Crafty.e("2D, DOM, Text")
        .attr({ x: w * 0.25, y: h * 0.45 + (data.index + 1) * 45, w })
        .text("Enter name: ")
        .textColor(data.color)
        .textAlign("left")
        .textFont({
          size: "20px",
          weight: "bold",
          family: "Press Start 2P",
        });
      const k = Crafty.e("TextInput")
        .attr({ x: w * 0.6, y: h * 0.45 + (data.index + 1) * 45, w })
        .textColor(data.color)
        .textAlign("left")
        .textFont({
          size: "20px",
          weight: "bold",
          family: "Press Start 2P",
        });

      const name = await k.textInput(data.player, 3);

      const loadList = function () {
        const dat = localStorage.getItem("SPDLZR");
        if (!dat) {
          return [];
        }
        const ko = dat.slice(0, 20);
        const d = dat.slice(20);
        s = CryptoJS.AES.decrypt(d, ko);
        const v = s.toString(CryptoJS.enc.Utf8);
        if (!(v.length > 1)) {
          return [];
        }
        return JSON.parse(v);
      };

      const l = loadList();
      l.push({
        initials: name,
        score: data.points,
        time: new Date().getTime(),
      });
      const d = JSON.stringify(l);
      const ky = CryptoJS.AES.encrypt(d, "secret").toString().slice(8, 28);
      const ed = CryptoJS.AES.encrypt(d, ky).toString();
      localStorage.setItem("SPDLZR", ky + ed);

      p.destroy();
      k.destroy();
    };

    Crafty("Player ControlScheme").each(function (index) {
      hs.push({ initials: null, player: this, score });
      collect.push(
        task({
          index,
          name: this.name,
          points: score,
          player: this,
          color: this.color(),
        }),
      );
    });

    hs = sortBy(hs, "score").reverse();
    await collect.reduce((p, t) => p.then(t), Promise.resolve());

    // After a timeout, be able to replay
    Crafty.e("Delay").delay(
      function () {
        if (!gameCompleted) {
          let time = 10;

          Crafty.e("2D, DOM, Text")
            .attr({ x: 0, y: h * 0.8, w })
            .textColor("#FF0000")
            .textAlign("center")
            .textFont({
              size: "15px",
              weight: "bold",
              family: "Press Start 2P",
            })
            .text("Continue at last checkpoint?");
          const e = Crafty.e("2D, DOM, Text")
            .attr({ x: 0, y: h * 0.8 + 30, w })
            .textColor("#FF0000")
            .textAlign("center")
            .textFont({
              size: "15px",
              weight: "bold",
              family: "Press Start 2P",
            });
          const prefix = "Press fire to continue";

          e.text(`${prefix} ${`00${time}`.slice(-2)}`);
          this.delay(
            function () {
              time -= 1;
              e.text(`${prefix} ${`00${time}`.slice(-2)}`);
            },
            1000,
            time,
            () => Crafty.enterScene("Scores"),
          );

          Crafty("Player").each(function () {
            this.reset();
            // add checkpoint mechanic
            this.one("Activated", () =>
              Crafty.enterScene("Game", {
                start: checkpoint,
                tags: settings.tags,
              }),
            );
          });
        } else {
          this.delay(() => Crafty.enterScene("Scores"), 5000);
        }
      },
      1000,
      0,
    );
  },
  () => {
    // destructor
    Crafty("Delay").each(function () {
      this.destroy();
    });
    Crafty("Player").each(function () {
      this.unbind("Activated");
    });
  },
);
