import { createScriptExecutionSpace } from "src/lib/dsl";
import stage1 from "src/scripts/stage1.lazer";

import PauseMenu from "src/lib/PauseMenu";
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

    new PauseMenu();

    Crafty.viewport.x = 0;
    Crafty.viewport.y = 0;
    const scriptEnvironment = createScriptExecutionSpace();
    await stage1(scriptEnvironment);
  },
  () => {
    // destructor
    Crafty(Player).each(function() {
      this.removeComponent("ShipSpawnable");
    });
    Crafty.unbind("GameOver");
    Crafty.unbind("ScriptFinished");
    Crafty.unbind("GamePause");
  }
);