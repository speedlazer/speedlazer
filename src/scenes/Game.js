import { createScriptExecutionSpace } from "src/lib/dsl";
import gameStructure from "src/scripts";
import { stopMusic } from "src/lib/audio";

import Player from "src/components/player/Player";

Crafty.defineScene(
  "Game",
  async () => {
    // import from globals
    Game.backgroundColor = null;

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

    Crafty.viewport.x = 0;
    Crafty.viewport.y = 0;
    const state = { lives: 2, score: 0 };
    const runner = createScriptExecutionSpace(state);
    try {
      for (const item of gameStructure) {
        await runner(item.script);
      }
      Crafty.enterScene("GameOver", {
        gameCompleted: true,
        score: state.score
      });
    } catch (e) {
      Crafty.enterScene("GameOver", { score: state.score });
    }
  },
  () => {
    // destructor
    stopMusic();
    Crafty(Player).each(function() {
      this.removeComponent("ShipSpawnable");
    });
    Crafty.unbind("GameOver");
    Crafty.unbind("ScriptFinished");
    Crafty.unbind("GamePause");
  }
);
