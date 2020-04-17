import { createScriptExecutionSpace } from "src/lib/dsl";
import gameStructure from "src/scripts";
import { stopMusic } from "src/lib/audio";

import Player from "src/components/player/Player";

Crafty.defineScene(
  "Game",
  async function({ start = null } = {}) {
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
        started = true;
        checkpoint = item.name;
        await runner(item.script);
      }
      Crafty.enterScene("GameOver", {
        gameCompleted: true,
        score: this.state.score
      });
    } catch (e) {
      console.log(checkpoint);
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
