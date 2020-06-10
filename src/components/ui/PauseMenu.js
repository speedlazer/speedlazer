import { centeredText } from "./text-helpers";
import { togglePause } from "src/lib/core/pauseToggle";
import Menu from "./Menu";

const PauseMenu = "PauseMenu";

const soundLabels = { 0: "Off", 10: "Max" };
const soundLevel = level => soundLabels[level] || level;
//await loadAudio(["effects", "hero"]);

let soundVolumeLevel = 5;
const soundOption = {
  getName: () => `Sound [${soundLevel(soundVolumeLevel)}]`,
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

/*
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
  soundOption,
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

Crafty.c(PauseMenu, {
  required: "UILayerDOM, 2D, Color",
  events: {
    Freeze() {
      this._children.forEach(child => child.freeze());
    },
    Unfreeze() {
      this._children.forEach(child => child.unfreeze());
    }
  },

  init() {},

  showMenu(controller) {
    if (this.menu) {
      this.menu.attachController(controller);
    } else {
      this.menuOptions(items, controller);
    }
    return this;
  },

  menuOptions(options, controller) {
    const menuWidth = 400;

    this.attr({
      x: (Crafty.viewport.width - menuWidth) / 2,
      w: menuWidth,
      alpha: 0.6,
      z: 200
    }).color("#222222");

    centeredText("Game paused", this, 20);

    this.menu = Crafty.e(Menu)
      .attr({ x: this.x, w: this.w, y: this.y + 70, z: this.z + 1 })
      .menu(options, controller);
    this.attach(this.menu);

    const menuHeight = this.menu.h + 70;
    this.attr({
      y: (Crafty.viewport.height - menuHeight) / 2,
      h: menuHeight
    });

    return this;
  }
});

export default PauseMenu;
