import "./ColorEffects";
import "./generic/ColorFade";
import "./Gradient";

Crafty.c("Backdrop", {
  init() {
    this.requires("2D, WebGL, Gradient, ColorFade");
    this.attr({
      x: 0,
      y: 0,
      w: Crafty.viewport.width,
      h: Crafty.viewport.height,
      z: -10000
    });
  }
});

let currentBackground = "#000000";

export const setBackgroundColor = (topColor, bottomColor = topColor) => {
  const backdrop = Crafty("Backdrop").get(0) || Crafty.e("Backdrop");
  backdrop.topColor(topColor);
  backdrop.bottomColor(bottomColor);
  currentBackground = bottomColor;
  Crafty("Horizon").forEach(entity =>
    entity.colorDesaturation(currentBackground)
  );
};

export const fadeBackgroundColor = async ({
  topColors,
  bottomColors,
  duration = 100
  //start = 0
}) =>
  new Promise(resolve => {
    const backdrop = Crafty("Backdrop").get(0) || Crafty.e("Backdrop");
    backdrop.colorFade({ duration, skip: 0 }, bottomColors, topColors);
    const updateHorizons = colors => {
      Crafty("Horizon").forEach(horizon =>
        horizon.colorDesaturation(colors.bottomColor)
      );
    };
    backdrop.bind("ColorFadeUpdate", updateHorizons);
    backdrop.one("ColorFadeFinished", () => {
      backdrop.unbind("ColorFadeUpdate", updateHorizons);
      resolve();
    });
  });

Crafty.c("Horizon", {
  init() {
    this.requires("ColorEffects");
    this.colorDesaturation(currentBackground);
  }
});
