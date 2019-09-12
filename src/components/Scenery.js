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

const PIXEL_BUFFER = 300;

Crafty.c("SceneryBlock", {
  init() {
    this.requires("2D, Motion");
    this.bind("Move", this.sceneryBlockMoved);
    this.bind("Freeze", this.sceneryBlockFreeze);
    this.bind("Unfreeze", this.sceneryBlockUnfreeze);
  },
  remove() {
    this.unbind("Move", this.sceneryBlockMoved);
  },
  sceneryBlockFreeze() {
    this._children.forEach(child => child.freeze());
  },
  sceneryBlockUnfreeze() {
    this._children.forEach(child => child.unfreeze());
  },
  moveScenery(dx, dy, includeSelf = true) {
    if (includeSelf) {
      this.shift(dx, dy);
    }
    const sceneryVectors = {
      v1: this.x,
      v2: this.x + this.w,
      v3: Infinity,
      v4: -Infinity
    };

    this._children.forEach(child => {
      if (child.distance === 1) return;
      child.shift(-dx * (1 - child.distance), -dy * (1 - child.distance));
      if (child.distance === this.farthestDistance) {
        if (child.x < sceneryVectors.v3) sceneryVectors.v3 = child.x;
        if (child.x + child.w > sceneryVectors.v4)
          sceneryVectors.v4 = child.x + child.w;
      }
    });
    this.sceneryVectors = sceneryVectors;
  },
  sceneryBlockMoved() {
    this.moveScenery(this.dx, this.dy, false);
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
    this.movingDirection = { vx: 0, vy: 0 };
    this.blocks = [];
    this.delay = null;
    this.bind("UpdateFrame", this.verifySceneryContent);
  },
  remove() {
    this.unbind("UpdateFrame", this.verifySceneryContent);
  },

  setNextScenery(sceneryName) {
    const scenery = sceneries[sceneryName];
    if (!scenery) return;
    if (this.blocks.length === 0) {
      this.startScenery(sceneryName, { direction: SCENERY_DIRECTIONS.ALL });
    } else {
      this.currentScenery = sceneryName;
    }
  },

  startScenery(
    sceneryName,
    { startXPos = 0, startYPos = 0, direction = SCENERY_DIRECTIONS.RIGHT } = {}
  ) {
    const scenery = sceneries[sceneryName];
    let block = this.blocks.find(
      b => b.__frozen && b.sceneryName === sceneryName
    );

    if (block) {
      block.unfreeze();
      const dx = startXPos - Math.floor(block.x);
      const dy = startYPos - Math.floor(block.y);
      block.moveScenery(dx, dy);
    } else {
      let staleBlock = this.blocks.find(b => b.__frozen);

      block = createBlock(scenery, startXPos, startYPos);
      block.sceneryName = sceneryName;
      if (staleBlock) {
        const index = this.blocks.indexOf(staleBlock);
        staleBlock.destroy();
        this.blocks[index] = block;
      } else {
        this.blocks.push(block);
      }
    }
    block.attr(this.movingDirection);

    if (
      direction === SCENERY_DIRECTIONS.RIGHT ||
      direction === SCENERY_DIRECTIONS.ALL
    ) {
      const nextPos = startXPos + block.w;
      const nextBlock = this.currentScenery || scenery.right;
      if (calcReach(block.farthestDistance, scenery.width) > nextPos) {
        this.currentScenery = null;
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
      const nextBlock = this.currentScenery || scenery.left;
      const leftScenery = sceneries[nextBlock];
      const nextPos = startXPos - leftScenery.width;
      if (-calcReach(block.farthestDistance, scenery.width) < nextPos) {
        this.currentScenery = null;
        this.startScenery(nextBlock, {
          startXPos: nextPos,
          startYPos,
          direction: SCENERY_DIRECTIONS.LEFT
        });
      }
    }
  },

  setScrollVelocity({ vx, vy }) {
    this.movingDirection = { vx, vy };
    this.blocks.forEach(block => block.attr({ vx, vy }));
    this.checkCountDown = 5;
  },

  verifySceneryContent() {
    const { vx, vy } = this.movingDirection;
    if (vx === 0 && vy === 0) return;
    this.checkCountDown--;
    if (this.checkCountDown > 0) return;

    const fps = Crafty.timer.FPS();
    this.checkCountDown = Math.min(
      PIXEL_BUFFER / Math.abs(vx) * fps,
      PIXEL_BUFFER / Math.abs(vy) * fps
    );

    const fullSceneryVector = this.blocks.reduce(
      (acc, block) => {
        if (block.__frozen) return acc;
        const sceneryVectors = block.sceneryVectors;
        return {
          v1: acc.v1 < sceneryVectors.v1 ? acc.v1 : sceneryVectors.v1,
          v2: acc.v2 > sceneryVectors.v2 ? acc.v2 : sceneryVectors.v2,
          v3: acc.v3 < sceneryVectors.v3 ? acc.v3 : sceneryVectors.v3,
          v4: acc.v4 > sceneryVectors.v4 ? acc.v4 : sceneryVectors.v4,
          left: acc.v1 < sceneryVectors.v1 ? acc.left : block,
          right: acc.v2 > sceneryVectors.v2 ? acc.right : block
        };
      },
      {
        v1: Infinity,
        v2: -Infinity,
        v3: Infinity,
        v4: -Infinity,
        left: null,
        right: null
      }
    );

    // Cleanup fase -- change v1 into v4
    if (vx < 0 && fullSceneryVector.left.sceneryVectors.v4 < 0) {
      fullSceneryVector.left.freeze();
    }

    // Build fase
    if (vx < 0 && fullSceneryVector.v4 < Crafty.viewport.width + PIXEL_BUFFER) {
      // scrolling to the left, check right side if content needs to be added
      const lastBlock = fullSceneryVector.right;
      const nextBlock =
        this.currentScenery || sceneries[lastBlock.sceneryName].right;

      this.currentScenery = null;
      this.startScenery(nextBlock, {
        startXPos: Math.floor(fullSceneryVector.v2),
        startYPos: 0, // TODO: Support vertical movement
        direction: SCENERY_DIRECTIONS.RIGHT
      });
      return;
    }
    console.log(
      "Enough content",
      fullSceneryVector.v2,
      this.blocks.length,
      this.blocks.filter(b => !b.__frozen).length
    );
  }
});
