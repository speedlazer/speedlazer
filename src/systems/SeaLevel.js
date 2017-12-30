Crafty.s("SeaLevel", {
  init() {
    this.offset = 0;
  },

  getSeaLevel(scale = 1.0) {
    const lvl = Crafty("ScrollWall").get(0).viewHeight;
    const perspective = (1 - scale) * (200 - lvl * 2.5);
    return Crafty.viewport.height - 20 - lvl - this.offset - perspective;
  },

  setOffset(value) {
    this.offset = value;
  }
});
