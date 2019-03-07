import spritesheets from "src/data/spritesheets";
import "src/components/Composable";
import "src/components/DebugComposable";
import "src/components/SpriteShader";
import { createEntity } from "src/components/EntityDefinition";

Crafty.paths({
  audio: "",
  images: ""
});

window.Crafty = Crafty;

const SCREEN_WIDTH = 900;
const SCREEN_HEIGHT = 600;

export const mount = domElem => {
  if (!domElem) return;
  Crafty.init(SCREEN_WIDTH, SCREEN_HEIGHT, domElem);
  Crafty.background("#000000");
};

const updateActualSize = (actualSize, entity) => {
  actualSize.minX = Math.min(actualSize.minX, entity.x);
  actualSize.maxX = Math.max(actualSize.maxX, entity.x + entity.w);
  actualSize.minY = Math.min(actualSize.minY, entity.y);
  actualSize.maxY = Math.max(actualSize.maxY, entity.y + entity.h);
};

const createComposable = composition =>
  Crafty.e("2D, WebGL, Composable, DebugComposable")
    .attr({ x: 0, y: 0, w: 40, h: 40 })
    .compose(composition);

const addColor = (entity, color) =>
  entity
    .addComponent("WebGL")
    .addComponent("Color")
    .color(color);

const determineEntitySize = (sizeModel, entity) => {
  updateActualSize(sizeModel, entity);
  if (entity.has("Composable")) {
    Object.values(entity.currentAttachHooks).forEach(hook => {
      updateActualSize(sizeModel, hook);
      if (hook.currentAttachment) {
        determineEntitySize(sizeModel, hook.currentAttachment);
      }
    });
    entity.forEachPart(entity => updateActualSize(sizeModel, entity));
  }
};

const scaleScreenForEntity = entity => {
  const actualSize = {
    minX: entity.x,
    maxX: entity.x + entity.w,
    minY: entity.y,
    maxY: entity.y + entity.h
  };
  determineEntitySize(actualSize, entity);

  const width = actualSize.maxX - actualSize.minX;
  const height = actualSize.maxY - actualSize.minY;
  const offset = {
    x: entity.x - actualSize.minX,
    y: entity.y - actualSize.minY
  };
  const scale = Math.min(SCREEN_WIDTH / width, SCREEN_HEIGHT / height, 1);
  const maxWidth = Math.max(width, SCREEN_WIDTH / scale);
  const maxHeight = Math.max(height, SCREEN_HEIGHT / scale);
  entity.attr({
    x: (maxWidth - width) / 2 + offset.x,
    y: (maxHeight - height) / 2 + offset.y
  });

  Crafty.viewport.scale(scale);
};

const applyDisplayOptions = (entity, options) => {
  Object.values(entity.currentAttachHooks).forEach(hook => {
    options.showAttachPoints
      ? hook.addComponent("SolidHitBox")
      : hook.removeComponent("SolidHitBox");
  });

  if (options.showSize) {
    addColor(entity, "#FF0000");
  } else {
    if (entity.has("Color")) {
      entity.color("#000000", 0);
    }
  }

  entity.displayHitBoxes(options.showHitBox);
  entity.displayRotationPoints(options.showRotationPoints);
};

Crafty.defineScene("ComposablePreview", ({ composition, options }) => {
  const composable = createComposable(composition);
  applyDisplayOptions(composable, options);
  scaleScreenForEntity(composable);
});

Crafty.defineScene("EntityPreview", ({ entityName }) => {
  const entity = createEntity(entityName);
  scaleScreenForEntity(entity);
});

const inScene = sceneName => Crafty._current === sceneName;

const loadSpriteSheets = async () =>
  new Promise(resolve => {
    // load sprites
    const loader = {
      sprites: {}
    };
    spritesheets.forEach(sheet => {
      loader.sprites[sheet.image] = sheet.map;
    });

    Crafty.load(loader, resolve);
  });

export const showComposition = async (composition, options = {}) => {
  if (inScene("ComposablePreview") && options.frame) {
    const currentComposable = Crafty("Composable").get(0);
    if (currentComposable.appliedDefinition === composition) {
      currentComposable.displayFrame(options.frame, options.tweenDuration);
      applyDisplayOptions(currentComposable, options);
      return;
    }
  }

  await loadSpriteSheets();
  Crafty.enterScene("ComposablePreview", { composition, options });
};

let currentEntity = null;
export const showEntity = async (entityName, options = {}) => {
  if (
    inScene("EntityPreview") &&
    options.state &&
    currentEntity === entityName
  ) {
    const currentEntity = Crafty("EntityDefinition").get(0);
    currentEntity.showState(options.state);
    return;
  }

  await loadSpriteSheets();
  Crafty.enterScene("EntityPreview", { entityName });
  currentEntity = entityName;
};
