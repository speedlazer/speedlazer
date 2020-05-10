import TweenPromise from "src/components/generic/TweenPromise";

let pointsPool = [];
Crafty.bind("SceneDestroy", () => (pointsPool = []));

const getPoints = () => {
  const available = pointsPool.find(e => e.__frozen);
  if (available) {
    available.unfreeze();
    return available.attr({ alpha: 1 });
  }
  const spawn = Crafty.e(`2D, Text, DOM, ${TweenPromise}`)
    .attr({ z: 400, alpha: 1 })
    .textColor("#EEEEEE")
    .textAlign("left")
    .textFont({
      size: "12px",
      weight: "bold",
      family: "Press Start 2P"
    });

  pointsPool = pointsPool.concat(spawn);
  return spawn;
};

const stateFunctions = (dsl, state) => {
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

  const score = (
    Crafty("HUDScore").get(0) ||
    Crafty.e(`2D, HUDScore, UILayerDOM, Text, HUD, ${TweenPromise}`)
      .attr({ x: 800, y: -10, w: 220, alpha: 0, score: 0, displayScore: 0 })
      .textColor("#FFFF00")
      .textAlign("left")
      .textFont({
        size: "8px",
        weight: "bold",
        family: "Press Start 2P"
      })
  )
    .text(function() {
      if (this.score > this.displayScore + 200) {
        this.displayScore += 10;
        this.textFont({ size: "9px" }).textColor("#FFFF80");
      } else if (this.score > this.displayScore + 100) {
        this.displayScore += 5;
        this.textFont({ size: "9px" }).textColor("#FFFF40");
      } else if (this.score > this.displayScore) {
        this.displayScore += 1;
        this.textFont({ size: "8px" });
      }
      return `Score: ${this.displayScore}`;
    })
    .dynamicTextGeneration(true);

  const closeScripts = [];

  const onSceneDestroy = () => dsl.closeScript();
  Crafty.one("SceneDestroy", onSceneDestroy);

  dsl.closeScript = () => {
    Crafty.unbind("SceneDestroy", onSceneDestroy);
    closeScripts.forEach(c => c());
  };

  return {
    onScriptClose: callback => {
      closeScripts.push(callback);
    },
    loseLife: () => {
      state.lives -= 1;
      if (state.lives < 0) {
        state.gameEnded = true;
        Crafty.trigger("GameOver");
        throw new Error("Game Over");
      }
      lives.text(`Lives: ${state.lives}`);
    },
    awardPoints: async (amount, x, y) => {
      state.score += amount;
      score.attr({ score: state.score });

      const points = getPoints()
        .attr({ x, y })
        .text(`+${amount}`);
      await points.tweenPromise({ y: y - 40, alpha: 0 }, 1000);
      points.freeze();
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
