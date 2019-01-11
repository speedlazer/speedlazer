import Crafty from "src/crafty-loader";
import spritesheets from "src/editor/data/spritesheets";
import "src/components/Composable";

Crafty.paths({
  audio: "",
  images: ""
});

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
  Crafty.e("2D, WebGL, Composable")
    .attr({ x: 0, y: 0, w: 40, h: 40 })
    .compose(composition);

const addColor = (entity, color) =>
  entity
    .addComponent("WebGL")
    .addComponent("Color")
    .color(color);

Crafty.defineScene("ComposablePreview", data => {
  const composable = createComposable(data.composition);

  composable.addComponent("SolidHitBox");
  addColor(composable, "#FF0000");

  const actualSize = {
    minX: composable.x,
    maxX: composable.x + composable.w,
    minY: composable.y,
    maxY: composable.y + composable.h
  };

  Object.values(composable.currentAttachHooks).forEach(hook => {
    hook.addComponent("SolidHitBox");
    updateActualSize(actualSize, hook);
  });

  composable.appliedDefinition.attachHooks
    .filter(([, options]) => options.testAttach)
    .forEach(([name, options]) => {
      //const hook = composable.currentAttachHooks[name];
      const attachComposition = data.file[options.testAttach];
      const attachEntity = createComposable(attachComposition);

      composable.attachEntity(name, attachEntity);

      attachEntity.forEachPart(entity => updateActualSize(actualSize, entity));
    });

  composable.forEachPart(entity => updateActualSize(actualSize, entity));

  const width = actualSize.maxX - actualSize.minX;
  const height = actualSize.maxY - actualSize.minY;
  const offset = {
    x: composable.x - actualSize.minX,
    y: composable.y - actualSize.minY
  };
  const scale = Math.min(SCREEN_WIDTH / width, SCREEN_HEIGHT / height, 1);
  const maxWidth = Math.max(width, SCREEN_WIDTH / scale);
  const maxHeight = Math.max(height, SCREEN_HEIGHT / scale);
  composable.attr({
    x: (maxWidth - width) / 2 + offset.x,
    y: (maxHeight - height) / 2 + offset.y
  });

  Crafty.viewport.scale(scale);
});

export const showComposition = (composition, file) => {
  // load sprites
  const loader = {
    sprites: {}
  };
  spritesheets.forEach(sheet => {
    loader.sprites[sheet.image] = sheet.map;
  });
  Crafty.load(loader, () => {
    Crafty.enterScene("ComposablePreview", { composition, file });
  });
};
