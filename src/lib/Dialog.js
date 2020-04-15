import { compositions } from "data";
import Composable from "src/components/Composable";

export const say = (speaker, text, { portrait = null } = {}) =>
  new Promise(resolve => {
    Crafty("Dialog").each(function() {
      this.trigger("Abort");
      this.destroy();
    });

    const lines = text.split("\n");

    const x = 60;
    const w = Crafty.viewport.width * 0.8;
    const bottom = Crafty.viewport.height - 20;
    const h = Math.max(4, lines.length + 1 + (speaker ? 1 : 0));

    const back = Crafty.e("2D, UILayerWebGL, Color, Tween, Dialog")
      .attr({ w, h: h * 20, alpha: 0 })
      .color("#000000")
      .attr({
        x: x - 10,
        y: bottom + 50,
        z: 100
      });
    back.bind("Abort", resolve);

    let avatarOffset = 0;

    const portraitDef = portrait && compositions(portrait);
    let portraitEntity = null;
    if (portraitDef) {
      portraitEntity = Crafty.e(
        ["2D", "UILayerWebGL", Composable, "Dialog"].join(", ")
      )
        .attr({ x: 0, y: 0, w: 40, h: 40 })
        .compose(portraitDef, { autoStartAnimation: false });

      portraitEntity.attr({
        x: back.x + 5,
        y: back.y + back.h - portraitEntity.h,
        z: back.z + 1
      });
      avatarOffset = portraitEntity.w + 10;
      back.attach(portraitEntity);
    }

    back.tween(
      {
        y: bottom - h * 20,
        alpha: 0.8
      },
      200
    );

    let offset = 15;
    if (speaker) {
      const speakerText = Crafty.e("2D, UILayerDOM, Text")
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
    const repeats = 1 + Math.ceil(wordCount / 4);
    let i = 0;

    Crafty.e("Dialog, Delay").delay(
      function() {
        i++;
        if (portraitEntity) {
          if (i === repeats) {
            portraitEntity.stopAnimation();
            portraitEntity.displayFrame("idle");
          } else {
            portraitEntity.playAnimation("talking");
          }
        }
      },
      1000,
      repeats,
      function() {
        back.one("TweenEnd", () => {
          Crafty("Dialog").each(function() {
            this.destroy();
          });
          resolve();
        });
        back.tween(
          {
            y: bottom + 50,
            alpha: 0
          },
          200
        );
      }
    );
  });
