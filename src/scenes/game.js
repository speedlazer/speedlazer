import { createScriptExecutionSpace } from "src/lib/dsl";
import stage1 from "src/scripts/stage1.lazer";

import Stage1 from "src/lazerscripts/stage1";
import PauseMenu from "src/lib/PauseMenu";
import levelGenerator from "src/lib/LevelGenerator";

let level = null;
let script = null;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

Crafty.defineScene(
  "Game",
  async (data = {}) => {
    // constructor
    //
    // import from globals
    Game.backgroundColor = null;
    level = levelGenerator.createLevel();

    Crafty.createLayer("UILayerDOM", "DOM", {
      scaleResponse: 0,
      yResponse: 0,
      xResponse: 0,
      z: 40
    });
    Crafty.createLayer("UILayerWebGL", "WebGL", {
      scaleResponse: 0,
      yResponse: 0,
      xResponse: 0,
      z: 35
    });
    Crafty.createLayer("StaticBackground", "WebGL", {
      scaleResponse: 0,
      yResponse: 0,
      xResponse: 0,
      z: 0
    });

    Crafty.e("BigText, LoadingText").bigText("Loading");

    // Load default sprites
    // This is a dirty fix to prevent
    // 'glDrawElements: attempt to render with no buffer attached to enabled attribute 6'
    // to happen mid-stage
    await levelGenerator.loadAssets(["explosion"]);

    const loadingTemp = Crafty.e("WebGL, explosion");
    await delay(100);
    loadingTemp.destroy();

    level.start();
    Crafty("Player").each(function() {
      this.level = level;
    });

    const options = {
      startAtCheckpoint: data.checkpoint != null ? data.checkpoint : 0
    };
    const startScript = data.script != null ? data.script : Stage1;

    const executeScript = async (scriptClass, options) => {
      if (scriptClass == null) {
        throw new Error("Script is not defined");
      }
      script = new scriptClass(level);
      try {
        await script.run(options);
        Crafty.trigger("ScriptFinished", script);
      } catch (e) {
        if (e.message !== "sequence mismatch") {
          throw e;
        }
      }
    };

    let checkpointsPassed = 0;

    Crafty.bind("ScriptFinished", async script => {
      const checkpoint = Math.max(
        0,
        script.startAtCheckpoint - script.currentCheckpoint
      );
      checkpointsPassed += script.currentCheckpoint;
      if (script.nextScript) {
        await executeScript(script.nextScript, {
          startAtCheckpoint: checkpoint
        });
      } else {
        if (script.gotoGameOver) {
          Crafty.enterScene("GameOver", { gameCompleted: true });
        }
      }
    });

    Crafty.bind("GameOver", () =>
      Crafty.enterScene("GameOver", {
        checkpoint: checkpointsPassed + script.currentCheckpoint,
        script: startScript
      })
    );

    new PauseMenu();

    let newCode = true;
    if (newCode) {
      // TODO: Extract this later, or get rid of it somehow
      level.inventoryAdd("weapon", "lasers", { marking: "L" });
      level.inventoryAdd("ship", "life", { marking: "❤", icon: "heart" });
      level.inventoryAdd("shipUpgrade", "healthu", {
        marking: "❤",
        icon: "heart"
      });
      level.inventoryAdd("shipBoost", "healthb", {
        marking: "❤",
        icon: "heart"
      });
      level.inventoryAdd("ship", "points", { marking: "P", icon: "star" });

      const scriptEnvironment = createScriptExecutionSpace(level);
      await stage1(scriptEnvironment);
    } else {
      executeScript(startScript, options);
    }
  },
  () => {
    // destructor
    script.end();
    level.stop();
    Crafty("Player").each(function() {
      this.removeComponent("ShipSpawnable");
    });
    Crafty.unbind("GameOver");
    Crafty.unbind("ScriptFinished");
    Crafty.unbind("GamePause");
  }
);
