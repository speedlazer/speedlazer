import { centeredText } from "./text-helpers";
import Menu from "./Menu";

const PauseMenu = "PauseMenu";

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
  },

  attachController(controller) {
    this.menu.attachController(controller);
  }
});

export default PauseMenu;
