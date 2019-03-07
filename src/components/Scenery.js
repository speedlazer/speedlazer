import sceneries from "src/data/sceneries";
import { getOne } from "src/lib/utils";

export const setScenery = sceneryName => {
  const scenery = getOne("Scenery") || Crafty.e("Scenery");
  scenery.setNextScenery(sceneryName);
};

const createBlock = (scenery, x, y) => {
  const block = Crafty.e("2D, WebGL, Color")
    .color("#0000FF")
    .attr({ x, y, z: -1000, w: scenery.width, h: scenery.height });
  scenery.elements.forEach(element => {
    const elementX = (element.x < 0 ? scenery.width : 0) + x + element.x;
    const elementY = (element.y < 0 ? scenery.height : 0) + y + element.y;

    const components = ["2D", ...element.c].join(", ");
    const entity = Crafty.e(components).attr({
      x: elementX,
      y: elementY,
      z: element.z
    });
    console.log(entity);
    //block.attach(entity);
  });

  return block;
};

Crafty.c("Scenery", {
  init() {
    console.log("Created Scenery");
    this.currentScenery = null;
    this.blocks = [];
  },

  setNextScenery(sceneryName) {
    const path = sceneryName.split(".");
    console.log("setting next scenery:", sceneryName);
    const scenery = path.reduce(
      (result, elem) => result && result[elem],
      sceneries
    );
    if (!scenery) return;
    const block = createBlock(scenery, 0, 0);
    console.log(scenery);
  }
});
