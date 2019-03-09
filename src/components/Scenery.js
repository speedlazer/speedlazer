import sceneries from "src/data/sceneries";
import compositions from "src/data/compositions";
import { getOne } from "src/lib/utils";

export const setScenery = sceneryName => {
  const scenery = getOne("Scenery") || Crafty.e("Scenery");
  scenery.setNextScenery(sceneryName);
};

Crafty.c("SceneryBlock", {
  updateSceneryPositions() {
    console.log("update children");
    const cameraCenter = {
      x: Crafty.viewport.width / 2,
      y: Crafty.viewport.height / 2
    };
    const blockCenter = {
      x: this.x + this.w / 2,
      y: this.y + this.h / 2
    };
    console.log({ cameraCenter, blockCenter });

    this._children.forEach(child => {
      // 0 = blockCenter - (this.w * child.distance)
      console.log("distance", child.distance);
    });
  }
});

const createBlock = (scenery, x, y) => {
  const block = Crafty.e("2D, WebGL, Color, SceneryBlock")
    .color("#0000FF")
    .attr({ x, y, z: -1000, w: scenery.width, h: scenery.height });
  scenery.elements.forEach(element => {
    const elementX = (element.x < 0 ? scenery.width : 0) + x + element.x;
    const elementY = (element.y < 0 ? scenery.height : 0) + y + element.y;

    let entity;
    if (element.composition) {
      entity = Crafty.e("2D, Composable")
        .compose(compositions[element.composition])
        .attr({ z: element.z });
    }
    if (element.components) {
      const components = ["2D"].concat(element.components);
      entity = Crafty.e(components.join(", ")).attr({
        z: element.z || 0,
        w: element.w,
        h: element.h
      });
    }
    entity.attr({
      x: elementX,
      y: elementY,
      distance: element.distance || 1
    });
    block.attach(entity);
  });
  block.updateSceneryPositions();

  return block;
};

Crafty.c("Scenery", {
  init() {
    this.currentScenery = null;
    this.blocks = [];
  },

  setNextScenery(sceneryName) {
    const scenery = sceneries[sceneryName];
    if (!scenery) return;
    const block = createBlock(scenery, 0, 0);
    //Crafty.viewport.scale(0.5);
  }
});
