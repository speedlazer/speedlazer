import Crafty from "../../crafty";
import { centeredText } from "./text-helpers";

const Menu = "Menu";

const itemColor = (selected, dangerous) => {
  if (selected) {
    return dangerous ? "#FF0000" : "#FFFF00";
  }
  return dangerous ? "#FF6666" : "#999999";
};

const itemLabel = item => (item.getName ? item.getName() : item.name);

const handleInteract = (itemEntity, action) => {
  const handler = itemEntity.item[action];

  if (!handler) return;
  handler();
  const newLabel = itemLabel(itemEntity.item);
  itemEntity.text(newLabel);
};

Crafty.c(Menu, {
  required: "2D",
  events: {
    Freeze() {
      if (this._detachController) {
        this._detachController();
        this._detachController = null;
      }
      this._children.forEach(child => child.freeze());
    },
    Unfreeze() {
      this._children.forEach(child => child.unfreeze());
    }
  },

  init() {},
  remove() {
    if (this._detachController) {
      this._detachController();
      this._detachController = null;
    }
  },

  menu(options, controller) {
    let menuHeight = 0;

    this.items = options.map(item => {
      if (item.spaceAbove) {
        menuHeight += 16;
      }
      const itemEntity = centeredText(
        itemLabel(item),
        this,
        menuHeight,
        itemColor(false, item.dangerous),
        "16px"
      );
      itemEntity.item = item;

      menuHeight += 32;
      return itemEntity;
    });

    this.attr({ h: menuHeight });

    this._menuItem = 0;
    this.selectOption(null, 0);

    this.attachController(controller);
    return this;
  },

  attachController(controller) {
    if (this._detachController) {
      this._detachController();
      this._detachController = null;
    }
    const down = () => {
      this._menuItem = this.selectOption(this._menuItem, 1);
    };
    const up = () => {
      this._menuItem = this.selectOption(this._menuItem, -1);
    };
    const left = () => {
      const activeItem = this.items[this._menuItem];
      handleInteract(activeItem, "left");
    };
    const right = () => {
      const activeItem = this.items[this._menuItem];
      handleInteract(activeItem, "right");
    };
    const fire = () => {
      const activeItem = this.items[this._menuItem];
      handleInteract(activeItem, "activate");
    };

    controller.bind("Down", down);
    controller.bind("Up", up);
    controller.bind("Left", left);
    controller.bind("Right", right);
    controller.bind("Fire", fire);

    this._detachController = () => {
      controller.unbind("Down", down);
      controller.unbind("Up", up);
      controller.unbind("Left", left);
      controller.unbind("Right", right);
      controller.unbind("Fire", fire);
    };

    return this;
  },

  selectOption(previousItem, delta) {
    const newItem =
      previousItem === null
        ? delta
        : (previousItem + this.items.length + delta) % this.items.length;
    if (previousItem !== newItem) {
      const deselect =
        previousItem !== null && this.items[previousItem].item.deselect;
      deselect && deselect();
      const select = this.items[newItem].item.select;
      select && select();
    }
    this.items.forEach((entity, i) =>
      entity.textColor(itemColor(i === newItem, entity.item.dangerous))
    );
    return newItem;
  }
});

export default Menu;
