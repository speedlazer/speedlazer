Crafty.c("DebugInfo", {
  init() {
    let frameTime = 0;
    let renderTime = 0;
    let slowestFrameTime = 0;
    let slowestRenderTime = 0;

    let slowFrameCount = 0;
    let slowRenderCount = 0;

    this.requires("2D, Text, Tween, Delay, UILayerDOM");
    this.attr({ x: 0, y: 20, w: Crafty.viewport.width - 30, z: 1 })
      .textAlign("right")
      .textColor("#FFFFFF")
      .textFont({
        size: "6px",
        family: "Press Start 2P"
      });
    this.bind("MeasureFrameTime", ms => {
      if (ms > slowestFrameTime) slowestFrameTime = ms;
      if (ms > 5) slowFrameCount++;
      frameTime = ms;
    });
    this.bind("MeasureRenderTime", ms => {
      if (ms > slowestRenderTime) slowestRenderTime = ms;
      if (ms > 5) slowRenderCount++;
      renderTime = ms;
    });
    this.bind("EnterFrame", fd => {
      this.text(
        `T: ${Math.round(Game.gameTime / 1000)}s ` +
          `RT: ${renderTime}ms ` +
          `SRT: ${slowestRenderTime}ms (${slowRenderCount}) ` +
          `FT: ${frameTime}ms ` +
          `SFT: ${slowestFrameTime}ms (${slowFrameCount}) ` +
          `E: ${Crafty("*").length} ` +
          `FPS: ${Math.round(1000 / fd.dt)}`
      );
    });
  },

  capture(name) {
    console.log(name, this.text());
  }
});
