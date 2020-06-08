import { sceneries, compositions } from "data";
import { getOne } from "src/lib/utils";
import PausableMotion from "src/components/PausableMotion";
import merge from "lodash/merge";

const choose = items => {
  let choice = Math.random();
  for (let k in items) {
    const weight = items[k];
    if (choice > weight) {
      choice -= weight;
    } else {
      return k;
    }
  }
};

const pick = sceneryList =>
  typeof sceneryList === "string" ? sceneryList : choose(sceneryList);

export const setScenery = sceneryName => {
  const scenery = getOne("Scenery") || Crafty.e("Scenery, 2D");
  scenery.setNextScenery(sceneryName);
};

export const setScrollVelocity = ({ vx, vy }) => {
  const scenery = getOne("Scenery") || Crafty.e("Scenery, 2D");
  scenery.setScrollVelocity({ vx, vy });
};

export const getScrollVelocity = () => {
  const scenery = getOne("Scenery") || Crafty.e("Scenery, 2D");
  return scenery.movingDirection;
};

export const setAltitude = newAltitude => {
  const scenery = getOne("Scenery") || Crafty.e("Scenery, 2D");
  scenery.setAltitude(newAltitude);
};

export const getAltitude = () => {
  const scenery = getOne("Scenery") || Crafty.e("Scenery, 2D");
  return scenery.altitude;
};

let notificationName = null;
let notificationBuffer = 0;
let notificationCallback = null;

const notifyScenery = () => {
  notificationCallback();
  notificationName = null;
  notificationBuffer = 0;
  notificationCallback = null;
};

export const getNotificationInScreen = (name, buffer = 0) =>
  new Promise(resolve => {
    notificationName = name;
    notificationBuffer = buffer;
    notificationCallback = resolve;
  });

const PIXEL_BUFFER = 800;

Crafty.c("SceneryBlock", {
  required: `2D, Motion, ${PausableMotion}`,

  init() {
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
  moveScenery(dx, dy, { vx, vy }) {
    this.shift(dx, dy);
    const vDx = dx - vx / Crafty.timer.FPS();
    const vDy = dy - vy / Crafty.timer.FPS();

    this._children.forEach(child => {
      if (child.distance === 1) return;
      child.shift(
        -vDx * (1 - child.distance),
        -vDy * (1 - child.distance * child.distance)
      );
    });
  },

  sceneryBlockMoved() {
    if (this.sceneryName === notificationName) {
      const vDx = this.vx / Crafty.timer.FPS();

      if (
        vDx <= 0 &&
        this.x >= -notificationBuffer &&
        this.x < -notificationBuffer - vDx
      ) {
        notifyScenery();
      } else if (
        vDx > 0 &&
        this.x > notificationBuffer - vDx &&
        this.x <= notificationBuffer
      ) {
        notifyScenery();
      }
    }

    const sceneryVectors = {
      v1: this.x,
      v2: this.x + this.w,
      v3: Infinity,
      v4: -Infinity
    };
    const dx = this.dx;
    const dy = this.dy;

    this._children.forEach(child => {
      if (child.distance === 1) return;
      child.shift(
        -dx * (1 - child.distance),
        -dy * (1 - child.distance * child.distance)
      );
      if (child.distance === this.farthestDistance) {
        if (child.x < sceneryVectors.v3) sceneryVectors.v3 = child.x;
        if (child.x + child.w > sceneryVectors.v4)
          sceneryVectors.v4 = child.x + child.w;
      }
    });
    this.sceneryVectors = sceneryVectors;
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
    const elementY = scenery.height * (distance * distance) + element.y;
    if (distance < farthestDistance) farthestDistance = distance;

    let entity;
    if (element.composition) {
      let def;
      if (typeof element.composition === "string") {
        def = compositions(element.composition);
      } else {
        def = merge(
          {},
          compositions(element.composition[0]),
          element.composition[1]
        );
      }

      entity = Crafty.e("2D, Composable")
        .compose(def)
        .attr({ z: element.z });
      if (element.frame) {
        entity.displayFrame(element.frame);
      }
    }
    if (element.components) {
      if (!entity) {
        const components = ["2D"].concat(element.components);
        entity = Crafty.e(components.join(", ")).attr({
          z: element.z || 0,
          w: element.w,
          h: element.h
        });
      } else {
        element.components.forEach(comp => entity.addComponent(comp));
      }
    }
    if (element.attributes) {
      entity.attr(element.attributes);
    }

    const centerX =
      blockCenter.x * distance + cameraCenter.x * (1.0 - distance);
    const centerY =
      blockCenter.y * (distance * distance) +
      cameraCenter.y * (1.0 - distance * distance);
    const left = centerX - halfW * distance;
    const top = centerY - halfH * (distance * distance);

    entity.attr({
      x: left + elementX,
      y: top + elementY,
      distance
    });
    block.attach(entity);
  });
  block.attr({ farthestDistance });
  return block;
};

const calcReach = (distance, width) => {
  const vpw = Crafty.viewport.width / Crafty.viewport._scale;
  return ((vpw - (vpw - width * distance) / 2) / (width * distance)) * width;
};

const SCENERY_DIRECTIONS = {
  RIGHT: 1,
  LEFT: 2,
  ALL: 3
};

Crafty.c("Scenery", {
  init() {
    this.currentScenery = null;
    this.movingDirection = { vx: 0, vy: 0 };
    this.altitude = 0;
    this.blocks = [];
    this.delay = null;
    this.bind("GameLoop", this.verifySceneryContent);
  },
  remove() {
    this.unbind("GameLoop", this.verifySceneryContent);
    this.blocks.forEach(b => b.destroy());
  },

  setNextScenery(sceneryName) {
    const scenery = sceneries(sceneryName);
    if (!scenery) return;
    if (this.blocks.length === 0) {
      this.startScenery(sceneryName, { direction: SCENERY_DIRECTIONS.ALL });
      this.checkCountDown = 5;
    } else {
      this.currentScenery = sceneryName;
    }
  },

  startScenery(
    sceneryName,
    {
      startXPos = 0,
      startYPos = null,
      direction = SCENERY_DIRECTIONS.RIGHT
    } = {}
  ) {
    this.altitude = startYPos || this.altitude;
    const scenery = sceneries(sceneryName);
    if (!scenery) throw new Error(`Scenery ${sceneryName} not found`);
    let block = this.blocks.find(
      b => b.__frozen && b.sceneryName === sceneryName
    );

    if (block) {
      block.unfreeze();
      const dx = startXPos - block.x;
      const dy = this.altitude - block.y;
      block.moveScenery(dx, dy, this.movingDirection);
    } else {
      let staleBlock = this.blocks.find(b => b.__frozen);

      block = createBlock(scenery, startXPos, this.altitude);
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
      const nextBlock = this.currentScenery || pick(scenery.right);
      if (calcReach(block.farthestDistance, scenery.width) > nextPos) {
        this.currentScenery = null;
        this.startScenery(nextBlock, {
          startXPos: nextPos,
          startYPos: this.altitude,
          direction: SCENERY_DIRECTIONS.RIGHT
        });
      }
    }
    if (
      direction === SCENERY_DIRECTIONS.LEFT ||
      direction === SCENERY_DIRECTIONS.ALL
    ) {
      const nextBlock = this.currentScenery || pick(scenery.left);
      const leftScenery = sceneries(nextBlock);
      const nextPos = startXPos - leftScenery.width;
      if (-calcReach(block.farthestDistance, scenery.width) < nextPos) {
        this.currentScenery = null;
        this.startScenery(nextBlock, {
          startXPos: nextPos,
          startYPos: this.altitude,
          direction: SCENERY_DIRECTIONS.LEFT
        });
      }
    }
  },

  setScrollVelocity({ vx, vy }) {
    this.movingDirection = { vx, vy };
    this.blocks.forEach(block => block.attr({ vx, vy }));
    if (this.checkCountDown > 5) {
      this.checkCountDown = this.blocks.length === 0 ? Infinity : 5;
    }
  },

  setAltitude(newAltitude) {
    this.blocks.forEach(
      block =>
        !block.__frozen &&
        block.moveScenery(0, newAltitude - this.altitude, this.movingDirection)
    );
    this.altitude = newAltitude;
  },

  verifySceneryContent() {
    const { vx, vy } = this.movingDirection;
    if (vx === 0 && vy === 0) return;
    this.checkCountDown--;
    if (this.checkCountDown > 0) return;

    const fps = Crafty.timer.FPS();
    this.checkCountDown = Math.min(
      (PIXEL_BUFFER / Math.abs(vx)) * fps,
      (PIXEL_BUFFER / Math.abs(vy)) * fps
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

    const vpw = Crafty.viewport.width / Crafty.viewport._scale;

    // Cleanup fase
    if (vx < 0 && fullSceneryVector.left.sceneryVectors.v4 < 0) {
      fullSceneryVector.left.attr({ vx: 0, vy: 0 });
      fullSceneryVector.left.freeze();
    }
    if (vx > 0 && fullSceneryVector.right.sceneryVectors.v3 > vpw) {
      fullSceneryVector.right.attr({ vx: 0, vy: 0 });
      fullSceneryVector.right.freeze();
    }

    // Build fase
    if (vx < 0 && fullSceneryVector.v4 < vpw + PIXEL_BUFFER) {
      // scrolling to the left, check right side if content needs to be added
      const lastBlock = fullSceneryVector.right;
      const nextBlock =
        this.currentScenery || pick(sceneries(lastBlock.sceneryName).right);

      this.currentScenery = null;
      this.startScenery(nextBlock, {
        startXPos: fullSceneryVector.v2 + vx / fps,
        startYPos: this.altitude,
        direction: SCENERY_DIRECTIONS.RIGHT
      });
      return;
    }
    if (vx > 0 && fullSceneryVector.v3 > -PIXEL_BUFFER) {
      // scrolling to the left, check right side if content needs to be added
      const firstBlock = fullSceneryVector.left;
      const nextBlock =
        this.currentScenery || pick(sceneries(firstBlock.sceneryName).left);

      this.currentScenery = null;
      const leftScenery = sceneries(nextBlock);
      const nextPos = fullSceneryVector.v1 - leftScenery.width;
      this.startScenery(nextBlock, {
        startXPos: nextPos + vx / fps,
        startYPos: this.altitude,
        direction: SCENERY_DIRECTIONS.LEFT
      });
      return;
    }
  }
});
