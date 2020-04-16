import Animation from "./Animation";

export const Background = "Background";

Crafty.c(Background, {
  required: ["2D, WebGL", Animation].join(","),

  init() {
    this.attr({
      x: 0,
      y: 0,
      w: Crafty.viewport.width / Crafty.viewport._scale,
      h: Crafty.viewport.height / Crafty.viewport._scale,
      z: -1000
    });
    this.bind("ViewportScale", this.updateBackdrop);
  },

  remove() {
    Object.keys(this.elements).forEach(key => {
      this.elements[key].destroy();
      delete this.elements[key];
    });
  },

  updateBackdrop() {
    this.attr({
      w: Crafty.viewport.width / Crafty.viewport._scale,
      h: Crafty.viewport.height / Crafty.viewport._scale
    });
  }
});

export default Background;

export const setBackground = (background, options) => {
  const backdrop = Crafty(Background).get(0) || Crafty.e(Background);
  backdrop.setAnimation(background, options);
};

export const setBackgroundCheckpoint = checkpoint => {
  const backdrop = Crafty(Background).get(0) || Crafty.e(Background);
  backdrop.setActiveCheckpoint(checkpoint);
};

export const getBackgroundCheckpoint = () => {
  const backdrop = Crafty(Background).get(0) || Crafty.e(Background);
  return backdrop.targetCheckpoint;
};

export const setBackgroundCheckpointLimit = limit => {
  const backdrop = Crafty(Background).get(0) || Crafty.e(Background);
  backdrop.setCheckpointLimit(limit);
};
