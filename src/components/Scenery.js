import sceneries from "src/data/sceneries";
import compositions from "src/data/compositions";
import { getOne } from "src/lib/utils";

export const setScenery = sceneryName => {
  const scenery = getOne("Scenery") || Crafty.e("Scenery");
  scenery.setNextScenery(sceneryName);
};

export const setScrollVelocity = ({ vx, vy }) => {
  const scenery = getOne("Scenery") || Crafty.e("Scenery");
  scenery.setScrollVelocity({ vx, vy });
};

Crafty.c("SceneryBlock", {
  init() {
    this.requires("2D, Motion");
    this.bind("Move", this.sceneryBlockMoved);
  },
  remove() {
    this.unbind("Move", this.sceneryBlockMoved);
  },
  sceneryBlockMoved() {
    this._children.forEach(child => {
      if (child.distance === 1) return;
      child.shift(
        -this.dx * (1 - child.distance),
        -this.dy * (1 - child.distance)
      );
    });
  }
});

const createBlock = (scenery, x, y) => {
  const block = Crafty.e("SceneryBlock").attr({
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
  let farthestDistance = 1;

  scenery.elements.forEach(element => {
    const distance = element.distance === undefined ? 1 : element.distance;
    const elementX = (element.x < 0 ? scenery.width * distance : 0) + element.x;
    const elementY =
      (element.y < 0 ? scenery.height * distance : 0) + element.y;
    if (distance < farthestDistance) farthestDistance = distance;

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
  block.attr({ farthestDistance });
  return block;
};

const calcReach = (distance, width) =>
  (Crafty.viewport.width - (Crafty.viewport.width - width * distance) / 2) /
  (width * distance) *
  width;

const SCENERY_DIRECTIONS = {
  RIGHT: 1,
  LEFT: 2,
  ALL: 3
};

Crafty.c("Scenery", {
  init() {
    this.currentScenery = null;
    this.blocks = [];
  },

  setNextScenery(sceneryName) {
    const scenery = sceneries[sceneryName];
    if (!scenery) return;
    if (this.currentScenery === null) {
      this.startScenery(sceneryName, { direction: SCENERY_DIRECTIONS.ALL });
      this.currentScenery = sceneryName;
    }
  },

  startScenery(
    sceneryName,
    { startXPos = 0, startYPos = 0, direction = SCENERY_DIRECTIONS.RIGHT } = {}
  ) {
    const scenery = sceneries[sceneryName];

    const block = createBlock(scenery, startXPos, startYPos);
    this.blocks.push(block);

    if (
      direction === SCENERY_DIRECTIONS.RIGHT ||
      direction === SCENERY_DIRECTIONS.ALL
    ) {
      const nextPos = startXPos + block.w;
      const nextBlock = scenery.right;
      if (calcReach(block.farthestDistance, scenery.width) > nextPos) {
        console.log("add next to Right");
        this.startScenery(nextBlock, {
          startXPos: nextPos,
          startYPos,
          direction: SCENERY_DIRECTIONS.RIGHT
        });
      }
    }
    if (
      direction === SCENERY_DIRECTIONS.LEFT ||
      direction === SCENERY_DIRECTIONS.ALL
    ) {
      const nextBlock = scenery.left;
      const leftScenery = sceneries[nextBlock];

      const nextPos = startXPos - leftScenery.width;
      if (-calcReach(block.farthestDistance, scenery.width) < nextPos) {
        console.log("add next to Left");
        this.startScenery(nextBlock, {
          startXPos: nextPos,
          startYPos,
          direction: SCENERY_DIRECTIONS.LEFT
        });
      }
    }
  },

  setScrollVelocity({ vx, vy }) {
    this.blocks.forEach(block => block.attr({ vx, vy }));
  }
});
