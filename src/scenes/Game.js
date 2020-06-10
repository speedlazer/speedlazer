import { createScriptExecutionSpace } from "src/lib/dsl";
import gameStructure from "src/scripts";
import PauseMenu from "src/components/ui/PauseMenu";
import Animation from "src/components/Animation";
import { stopMusic, fadeMusicVolume } from "src/lib/audio";
import { fadeOut } from "src/components/generic/ColorFade";
import { togglePause } from "src/lib/core/pauseToggle";

import Player from "src/components/player/Player";
const DEFAULT_TAGS = ["campaign"];

/*
const soundLabels = { 0: "Off", 10: "Max" };
const soundLevel = level => soundLabels[level] || level;

let soundVolumeLevel = 5;
const soundOption = {
  getName: () => `Sound - ${soundLevel(soundVolumeLevel)}`,
  left: () => {
    soundVolumeLevel = Math.max(0, soundVolumeLevel - 1);
  },
  right: () => {
    soundVolumeLevel = Math.min(10, soundVolumeLevel + 1);
  },
  select: () => {
    console.log("Select");
  },
  deselect: () => {
    console.log("Deselect");
  }
};

let musicVolumeLevel = 5;
const musicOption = {
  getName: () => `Music - ${soundLevel(musicVolumeLevel)}`,
  left: () => {
    musicVolumeLevel = Math.max(0, musicVolumeLevel - 1);
  },
  right: () => {
    musicVolumeLevel = Math.min(10, musicVolumeLevel + 1);
  },
  select: () => {
    console.log("Select");
  },
  deselect: () => {
    console.log("Deselect");
  }
};
*/

const items = [
  //{ name: "Controls" },
  {
    name: "Resume",
    activate: () => {
      setTimeout(() => togglePause());
    }
  },
  //soundOption,
  //musicOption,
  {
    name: "Restart",
    spaceAbove: true,
    dangerous: true,
    activate: () => {
      setTimeout(() => {
        togglePause();
        Crafty.trigger("EndGame", { mode: "restart" });
        Crafty.enterScene("Game");
      });
    }
  },
  {
    name: "Quit",
    dangerous: true,
    activate: () => {
      setTimeout(() => {
        togglePause();
        Crafty.trigger("EndGame", { mode: "quit" });
        Crafty.enterScene("Intro");
      });
    }
  }
];

Crafty.defineScene(
  "Game",
  async function({ start = null, tags = DEFAULT_TAGS } = {}) {
    let pauseMenu = null;
    Crafty.bind("GamePause", paused => {
      if (paused) {
        const player = Crafty("Player").get(0);
        if (pauseMenu === null) {
          pauseMenu = Crafty.e(PauseMenu).menuOptions(items, player);
        } else {
          pauseMenu.unfreeze();
          pauseMenu.attachController(player);
        }
      } else {
        pauseMenu.freeze();
      }
    });

    let endMode = null;
    Crafty.one("EndGame", event => {
      endMode = event.mode;
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
      const fade = fadeOut();
      fadeMusicVolume(0, 2000);
      await fade.start(2000);
      Crafty.enterScene("GameOver", {
        gameCompleted: !this.state.gameEnded,
        score: this.state.score
      });
    } catch (e) {
      if (endMode !== null) return;
      if (e.message !== "Game Over") {
        console.error(e);
      }
      const fade = fadeOut();
      fadeMusicVolume(0, 2000);
      await fade.start(2000);
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
    Crafty(Animation).each(function() {
      this.destroy();
    });
    Crafty.unbind("GameOver");
    Crafty.unbind("ScriptFinished");
    Crafty.unbind("GamePause");
  }
);
