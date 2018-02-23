export const say = (speaker, text, settings) =>
  new Promise(resolve => {
    Crafty("Dialog").each(function() {
      this.trigger("Abort");
      this.destroy();
    });

    const lines = text.split("\n");

    const avatar = {
      General: { n: "pGeneral", l: [0, 0] },
      John: { n: "pPilot", l: [0, 4] }
    }[speaker];

    const x = 60;
    const w = Crafty.viewport.width * 0.8;
    const h = Math.max(avatar ? 4 : 0, lines.length + 1 + (speaker ? 1 : 0));

    const back = Crafty.e("2D, WebGL, Color, Tween, Dialog")
      .attr({ w, h: h * 20, alpha: 0.7 })
      .color("#000000")
      .attr({
        x: x - 10,
        y: settings.bottom - h * 20,
        z: 100
      });
    back.bind("Abort", resolve);

    const avatarOffset = avatar ? 100 : 0;
    if (avatar) {
      const portrait = Crafty.e("2D, WebGL, SpriteAnimation")
        .addComponent(avatar.n)
        .sprite(avatar.l, 4, 4)
        .attr({
          x: back.x + 5,
          y: back.y - 20,
          z: back.z + 1,
          w: 96,
          h: 96
        })
        .reel("talk", 400, [avatar.l, [avatar.l[0] + 4, avatar.l[1]]])
        .animate("talk", lines.length * 6);
      back.attach(portrait);

      // add noise to level
      if (settings.noise !== "none" && avatar) {
        portrait.addComponent("Delay");
        portrait.delay(
          () =>
            portrait.attr({
              alpha: 0.6 + Math.random() * 0.3
            }),
          150,
          -1
        );
      }
    }

    let offset = 15;
    if (speaker) {
      const speakerText = Crafty.e("2D, DOM, Text")
        .attr({
          w: w - 20,
          x: back.x + 10 + avatarOffset,
          y: back.y + 10,
          z: 101,
          alpha: 1
        })
        .text(speaker)
        .textColor("#707070")
        .textFont({
          size: "10px",
          weight: "bold",
          family: "Press Start 2P"
        });
      back.attach(speakerText);
      offset = 30;
    }

    lines.forEach((line, i) => {
      back.attach(
        Crafty.e("2D, UILayerDOM, Text")
          .attr({
            w: w - 20,
            x: back.x + 10 + avatarOffset,
            y: back.y + offset + i * 20,
            z: 101
          })
          .text(line)
          .textColor("#909090")
          .textFont({
            size: "10px",
            weight: "bold",
            family: "Press Start 2P"
          })
      );
    });

    const wordCount = lines.join(" ").split(" ").length;

    Crafty.e("Dialog, Delay").delay(
      function() {
        resolve();
        Crafty("Dialog").each(function() {
          this.destroy();
        });
      },
      1500 * Math.ceil(wordCount / 5),
      0
    );
  });
