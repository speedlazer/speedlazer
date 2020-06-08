const PauseMenu = "PauseMenu";

const centeredText = (text, y, color = "#FFFFFF", size = "20px") =>
  Crafty.e("2D, UILayerDOM, Text")
    .attr({ x: 0, y, w: Crafty.viewport.width, z: 240 })
    .text(text)
    .textColor(color)
    .textAlign("center")
    .textFont({
      size: size,
      weight: "bold",
      family: "Press Start 2P"
    });

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

  menuOptions(options) {
    const menuWidth = 400;
    const menuHeight = options.length * 32 + 90;

    this.attr({
      x: (Crafty.viewport.width - menuWidth) / 2,
      y: (Crafty.viewport.height - menuHeight) / 2,
      w: menuWidth,
      h: menuHeight,
      alpha: 0.6,
      z: 200
    }).color("#222222");
    const paused = centeredText("Game paused", this.y + 20);
    this.attach(paused);

    this.items = options.map((item, index) => {
      const itemEntity = centeredText(
        item.name,
        this.y + 70 + index * 32,
        "#999999",
        "16px"
      );
      this.attach(itemEntity);
      return itemEntity;
    });

    return this;
  },

  selectOption(index) {
    this.items.forEach((entity, i) =>
      entity.textColor(i === index ? "#FFFF00" : "#999999")
    );
  }
});

export default PauseMenu;
