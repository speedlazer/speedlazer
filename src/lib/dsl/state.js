import TweenPromise from "src/components/generic/TweenPromise";

const stateFunctions = (_, state) => {
  const lives = (
    Crafty("HUDLives").get(0) ||
    Crafty.e(`2D, HUDLives, UILayerDOM, Text, HUD, ${TweenPromise}`)
      .attr({ x: 20, y: -10, w: 100, alpha: 0 })
      .textColor("#FFFF00")
      .textAlign("left")
      .textFont({
        size: "8px",
        weight: "bold",
        family: "Press Start 2P"
      })
  ).text(`Lives: ${state.lives}`);

  return {
    loseLife: () => {
      state.lives -= 1;
      if (state.lives < 0) {
        state.gameEnded = true;
        Crafty.trigger("GameOver");
        throw new Error("Game Over");
      }
      lives.text(`Lives: ${state.lives}`);
    },
    showHUD: () => {
      if (state.hudShown === true) return;
      state.hudShown = true;
      const results = [];
      Crafty("HUD").each(function() {
        if (this.tweenPromise) {
          results.push(this.tweenPromise({ alpha: 1, y: 10 }, 300));
        }
      });
      return Promise.all(results);
    },
    hideHUD: () => {
      if (state.hudShown !== true) return;
      state.hudShown = false;
      const results = [];
      Crafty("HUD").each(function() {
        if (this.tweenPromise) {
          results.push(this.tweenPromise({ alpha: 0, y: -10 }, 300));
        }
      });
      return Promise.all(results);
    }
  };
};

export default stateFunctions;
