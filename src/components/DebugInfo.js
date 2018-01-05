Crafty.c("DebugInfo", {
  init() {
    this.requires("2D, Text, Tween, Delay, UILayerDOM");
    this.attr({ x: 0, y: 20, w: Crafty.viewport.width - 30, z: 1 })
      .textAlign("right")
      .textColor("#FFFFFF")
      .textFont({
        size: "14px",
        family: "Press Start 2P"
      });
    this.bind("EnterFrame", fd => {
      this.text(
        `T: ${Math.round(Game.gameTime / 1000)}s ` +
        `E: ${Crafty("*").length} ` +
        `FPS: ${Math.round(1000 / fd.dt)}`
      );
    });
  }
});
