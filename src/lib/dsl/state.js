import TweenPromise from "src/components/generic/TweenPromise";
import Health from "src/components/Health";

let pointsPool = [];
Crafty.bind("SceneDestroy", () => (pointsPool = []));

const getAwardText = () => {
  const available = pointsPool.find(e => e.__frozen);
  if (available) {
    available.unfreeze();
    return available.attr({ alpha: 1 });
  }
  const spawn = Crafty.e(`2D, Text, DOM, ${TweenPromise}`)
    .attr({ z: 400, alpha: 1, w: 300 })
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

  const health =
    Crafty("HUDHealth").get(0) ||
    Crafty.e(
      `2D, HUDHealth, UILayerWebGL, HUD, ${Health}, ${TweenPromise}`
    ).attr({ x: 150, y: -10, w: 120, h: 5, alpha: 0, maxWidth: 120 });

  Crafty("HUDHealthBar").get(0) ||
    Crafty.e(`2D, HUDHealthBar, UILayerWebGL, Color, HUD, ${TweenPromise}`)
      .attr({ x: 149, y: -11, w: 122, h: 7, z: -1, alpha: 0, baseAlpha: 0.6 })
      .color("#000000");

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
    .dynamicTextGeneration(true, "GameLoop");

  const closeScripts = [];

  const onSceneDestroy = () => dsl.closeScript();
  Crafty.one("SceneDestroy", onSceneDestroy);

  dsl.closeScript = () => {
    Crafty.unbind("SceneDestroy", onSceneDestroy);
    closeScripts.forEach(c => c());
  };

  const awardText = async (text, x, y) => {
    const award = getAwardText()
      .attr({ x, y })
      .text(text);
    await award.tweenPromise({ y: y - 40, alpha: 0 }, 1000);
    award.freeze();
  };

  return {
    onScriptClose: callback => {
      closeScripts.push(callback);
    },
    setHealthbar: healthPerc => {
      health.attr({ health: healthPerc });
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
    gainLife: () => {
      state.lives += 1;
      lives.text(`Lives: ${state.lives}`);
    },
    awardPoints: async (amount, x, y) => {
      state.score += amount;
      score.attr({ score: state.score });
      await awardText(`+${amount}`, x, y);
    },
    awardText,
    showHUD: () => {
      if (state.hudShown === true) return;
      state.hudShown = true;
      const results = [];
      Crafty("HUD").each(function() {
        if (this.tweenPromise) {
          results.push(
            this.tweenPromise(
              {
                alpha: this.baseAlpha === undefined ? 1 : this.baseAlpha,
                y: this.y + 20
              },
              500
            )
          );
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
          results.push(this.tweenPromise({ alpha: 0, y: this.y - 20 }, 500));
        }
      });
      return Promise.all(results);
    }
  };
};

export default stateFunctions;
