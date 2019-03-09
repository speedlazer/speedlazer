import sceneries from "src/data/sceneries";
import compositions from "src/data/compositions";
import { getOne } from "src/lib/utils";

export const setScenery = sceneryName => {
  const scenery = getOne("Scenery") || Crafty.e("Scenery");
  scenery.setNextScenery(sceneryName);
};

Crafty.c("SceneryBlock", {});

const createBlock = (scenery, x, y) => {
  const block = Crafty.e("2D, WebGL, SceneryBlock").attr({
    x,
    y,
    w: scenery.width,
    h: scenery.height
  });
  const cameraCenter = {
    x: Crafty.viewport.width / 2,
    y: Crafty.viewport.height / 2
  };
  const halfW = block.w / 2;
  const halfH = block.h / 2;
  const blockCenter = {
    x: x + halfW,
    y: y + halfH
  };
  scenery.elements.forEach(element => {
    const distance = element.distance === undefined ? 1 : element.distance;
    const elementX = (element.x < 0 ? scenery.width * distance : 0) + element.x;
    const elementY =
      (element.y < 0 ? scenery.height * distance : 0) + element.y;

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
    const centerX =
      blockCenter.x * distance + cameraCenter.x * (1.0 - distance);
    const centerY =
      blockCenter.y * distance + cameraCenter.y * (1.0 - distance);
    const left = centerX - halfW * distance;
    const top = centerY - halfH * distance;

    entity.attr({
      x: Math.floor(left + elementX),
      y: Math.floor(top + elementY),
      distance
    });
    block.attach(entity);
  });

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

    createBlock(scenery, 0, 0);
    createBlock(scenery, 1024, 0);
    createBlock(scenery, -1024, 0);
  }
});
