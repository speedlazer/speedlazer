import Composable from "./Composable";
import compositions from "src/data/compositions";

export const Background = "Background";

Crafty.c(Background, {
  required: ["2D, WebGL"].join(","),

  init() {
    this.attr({
      x: 0,
      y: 0,
      w: Crafty.viewport.width / Crafty.viewport._scale,
      h: Crafty.viewport.height / Crafty.viewport._scale,
      z: -10000
    });
    this.bind("ViewportScale", this.updateBackdrop);
  },

  updateBackdrop() {
    this.attr({
      w: Crafty.viewport.width / Crafty.viewport._scale,
      h: Crafty.viewport.height / Crafty.viewport._scale
    });
  },

  setBackground(background) {
    (background.composables || []).forEach(([composable, settings]) => {
      const composition = compositions[composable];
      const sub = Crafty.e(["2D", "WebGL", Composable].join(","))
        .attr({ x: 0, y: 0, w: 40, h: 40 })
        .compose(composition);

      sub.displayFrame(settings.frame || "default");

      console.log(settings);
    });
  }
});

export default Background;

export const setBackground = background => {
  const backdrop = Crafty(Background).get(0) || Crafty.e(Background);
  backdrop.setBackground(background);
};
