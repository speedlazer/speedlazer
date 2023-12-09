import Crafty from "../crafty";
import settings from "../settings.json";

const credits = [
  ["Designed by", ["Matthijs Groen"]],
  ["Programming", ["Matthijs Groen"]],
  ["Graphics", ["Matthijs Groen", "& Midjourney"]],
  ["Music", ["Some Midis"]],
  ["Testing", ["Matthijs Groen"]],
];

const NAME_DURATION = 1500;

Crafty.defineScene(
  "Credits",
  function () {
    // import from globals
    // constructor
    Crafty.background("#000000");
    Crafty.viewport.x = 0;
    Crafty.viewport.y = 0;

    const w = Crafty.viewport.width;
    const h = Crafty.viewport.height;
    let i = 0;
    Crafty.e("2D, DOM, Text, CreditTask")
      .attr({ x: 0, y: h * 0.4, w })
      .textColor("#FF0000")
      .textAlign("center")
      .textFont({
        size: "30px",
        weight: "bold",
        family: "Press Start 2P",
      });
    Crafty.e("2D, DOM, Text, CreditNames")
      .attr({ x: 0, y: h * 0.5, w, h: 300 })
      .textColor("#FFFF00")
      .textAlign("center")
      .textFont({
        size: "20px",
        weight: "bold",
        family: "Press Start 2P",
      });

    const title = credits[i][0];
    const names = credits[i][1];
    Crafty("CreditTask").text(title);
    Crafty("CreditNames").text(names.join("\n"));

    Crafty.e("Delay").delay(
      () => {
        i += 1;
        const title = credits[i][0];
        const names = credits[i][1];

        Crafty("CreditTask").text(title);
        Crafty("CreditNames").text(names.join("\n"));
      },
      NAME_DURATION,
      credits.length - 2,
    );

    Crafty("Player").each(function () {
      this.reset();
      this.one("Activated", () =>
        Crafty.enterScene("Game", { tags: settings.tags }),
      );
    });

    Crafty.e("Delay").delay(
      () => Crafty.enterScene("Intro"),
      credits.length * NAME_DURATION,
    );
  },
  function () {
    // destructor
    Crafty("Delay").each(function () {
      this.destroy();
    });
    return Crafty("Player").each(function () {
      this.unbind("Activated");
    });
  },
);
