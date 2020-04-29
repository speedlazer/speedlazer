import { createScriptExecutionSpace } from "src/lib/dsl";
import gameStructure from "src/scripts";
import { stopMusic } from "src/lib/audio";

import Player from "src/components/player/Player";
const DEFAULT_TAGS = ["campaign"];

Crafty.defineScene(
  "Game",
  async function({ start = null, tags = DEFAULT_TAGS } = {}) {
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

    Crafty.viewport.x = 0;
    Crafty.viewport.y = 0;
    this.state = { lives: 2, score: 0 };
    const runner = createScriptExecutionSpace(this.state);
    let checkpoint = null;
    try {
      let started = false;
      for (const item of gameStructure) {
        if (!started && start !== null && start !== item.name) {
          continue;
        }
        if (!tags.every(tag => item.tags[tag] === true)) {
          continue;
        }
        /* eslint-env node */
        if (item.tags.wip === true && process.env.APP_ENV !== "development") {
          continue;
        }
        started = true;
        checkpoint = item.name;
        await runner(item.script);
      }
      Crafty.enterScene("GameOver", {
        gameCompleted: !this.state.gameEnded,
        score: this.state.score
      });
    } catch (e) {
      if (e.message !== "Game Over") {
        console.error(e);
      }
      Crafty.enterScene("GameOver", {
        score: this.state.score,
        checkpoint
      });
    }
  },
  function() {
    this.state.gameEnded = true;
    stopMusic();
    // destructor
    Crafty(Player).each(function() {
      this.removeComponent("ShipSpawnable");
    });
    Crafty.unbind("GameOver");
    Crafty.unbind("ScriptFinished");
    Crafty.unbind("GamePause");
  }
);
