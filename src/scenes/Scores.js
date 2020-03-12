const getNum = num => {
  switch (num) {
    case 0:
      return "ACE";
    case 1:
      return "2nd";
    case 2:
      return "3rd";
    default:
      return `${num + 1}th`;
  }
};

const getSize = num => {
  switch (num) {
    case 0:
      return "20px";
    case 1:
    case 2:
      return "18px";
    default:
      return "15px";
  }
};

Crafty.defineScene(
  "Scores",
  function() {
    // import from globals
    // constructor
    Crafty.background("#000000");
    Crafty.viewport.x = 0;
    Crafty.viewport.y = 0;

    const w = Crafty.viewport.width;
    const h = Crafty.viewport.height;

    Crafty.e("2D, DOM, Text")
      .attr({ x: 0, y: h * 0.1, w })
      .text("Highscores")
      .textColor("#FFFF00")
      .textAlign("center")
      .textFont({
        size: "40px",
        weight: "bold",
        family: "Press Start 2P"
      });

    const scores = Game.highscores();
    let i = 0;
    Crafty.e("Delay").delay(
      function() {
        const entry = scores[i];
        if (entry) {
          const nr = getNum(i);
          const size = getSize(i);

          Crafty.e("2D, DOM, Text")
            .attr({ x: 0, y: h * 0.25 + 36 * i, w })
            .text(`${nr}  ${entry.score} ${entry.initials}`)
            .textColor("#FFFF00")
            .textAlign("center")
            .textFont({
              size,
              weight: "bold",
              family: "Press Start 2P"
            });

          i += 1;
        }
      },
      500,
      9
    );

    Crafty("Player").each(function() {
      this.reset();
      this.one("Activated", () => Crafty.enterScene("Game"));
    });

    Crafty.e("Delay").delay(() => Crafty.enterScene("Credits"), 20000);
  },
  function() {
    // destructor
    Crafty("Delay").each(function() {
      this.destroy();
    });
    return Crafty("Player").each(function() {
      this.unbind("Activated");
    });
  }
);
