import spritesheets from "src/data/spritesheets";
import backgrounds from "src/data/backgrounds";
import Composable from "src/components/Composable";
import "src/components/DebugComposable";
import "src/components/SpriteShader";
import {
  setBackground,
  setBackgroundCheckpoint
} from "src/components/Background";
import { createEntity } from "src/components/EntityDefinition";
import { setScenery, setScrollVelocity } from "src/components/Scenery";
import "src/components/WayPointMotion";
import { getBezierPath } from "src/lib/BezierPath";

Crafty.paths({
  audio: "",
  images: ""
});

window.Crafty = Crafty;

const SCREEN_WIDTH = 1024;
const SCREEN_HEIGHT = 576;

export const mount = domElem => {
  if (!domElem) return;
  Crafty.init(SCREEN_WIDTH, SCREEN_HEIGHT, domElem);
  Crafty.background("#000000");
};

Crafty.bind("UpdateFrame", fd => Crafty.trigger("GameLoop", fd));

const updateActualSize = (actualSize, entity) => {
  actualSize.minX = Math.min(actualSize.minX, entity.x);
  actualSize.maxX = Math.max(actualSize.maxX, entity.x + entity.w);
  actualSize.minY = Math.min(actualSize.minY, entity.y);
  actualSize.maxY = Math.max(actualSize.maxY, entity.y + entity.h);
};

const createComposable = composition =>
  Crafty.e(["2D", "WebGL", Composable, "DebugComposable"].join(", "))
    .attr({ x: 0, y: 0, w: 40, h: 40 })
    .compose(composition);

const addColor = (entity, color) =>
  entity
    .addComponent("WebGL")
    .addComponent("Color")
    .color(color);

const determineEntitySize = (sizeModel, entity) => {
  updateActualSize(sizeModel, entity);
  if (entity.has(Composable)) {
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
  if (!entity.preScalePos) {
    entity.preScalePos = { x: entity.x, y: entity.y };
  }

  entity.attr({
    x: (maxWidth - width) / 2 + offset.x,
    y: (maxHeight - height) / 2 + offset.y
  });

  Crafty.viewport.scale(scale);
};

const resetScreenScaling = entity => {
  if (entity.preScalePos) {
    entity.attr({ x: entity.preScalePos.x, y: entity.preScalePos.y });
  }
  Crafty.viewport.scale(1.0);
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
  if (options.scaleViewport) {
    scaleScreenForEntity(composable);
  } else {
    resetScreenScaling(composable);
  }
});

let activeHabitat = null;
const setHabitat = habitat => {
  if (!habitat || !habitat.scenery || habitat.scenery !== activeHabitat) {
    Crafty("Scenery").destroy();
  }
  habitat &&
    habitat.scenery &&
    habitat.scenery !== activeHabitat &&
    setScenery(habitat.scenery);

  if (habitat && habitat.background) {
    setBackground(backgrounds[habitat.background[0]]);
    setBackgroundCheckpoint(habitat.background[1]);
  } else {
    Crafty("Background").destroy();
  }

  habitat &&
    habitat.scrollSpeed &&
    (habitat.scenery
      ? setScrollVelocity(habitat.scrollSpeed)
      : setScrollVelocity({ vx: 0, vy: 0 }));
};

Crafty.defineScene("EntityPreview", ({ entityName, habitat }) => {
  const entity = createEntity(entityName);
  setHabitat(habitat);

  scaleScreenForEntity(entity);
});

Crafty.defineScene(
  "SceneryPreview",
  async ({ scenery, background, checkpoint }) => {
    if (background) {
      setBackground(background);
      setBackgroundCheckpoint(checkpoint);
    }
    setScenery(scenery);
  },
  () => {
    Crafty("Scenery").destroy();
  }
);

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

let scaleViewport = true;
export const showComposition = async (composition, options = {}) => {
  if (inScene("ComposablePreview") && options.frame) {
    const currentComposable = Crafty(Composable).get(0);
    if (currentComposable.appliedDefinition === composition) {
      currentComposable.displayFrame(options.frame, options.tweenDuration);
      applyDisplayOptions(currentComposable, options);
      if (options.scaleViewport !== scaleViewport) {
        scaleViewport = options.scaleViewport;
        if (options.scaleViewport) {
          scaleScreenForEntity(currentComposable);
        } else {
          resetScreenScaling(currentComposable);
        }
      }
      return;
    }
  }

  await loadSpriteSheets();
  Crafty.enterScene("ComposablePreview", { composition, options });
};

let currentEntity = null;
let currentHabitat = null;
export const showEntity = async (entityName, options = {}) => {
  const strHabitat = JSON.stringify(options.habitat);
  if (
    inScene("EntityPreview") &&
    options.state &&
    currentEntity === entityName
  ) {
    const existingEntity = Crafty("EntityDefinition").get(0);
    existingEntity.showState(options.state);

    if (strHabitat !== currentHabitat) {
      currentHabitat = strHabitat;
      setHabitat(options.habitat);
    }
    return;
  }
  currentEntity = entityName;
  currentHabitat = strHabitat;

  await loadSpriteSheets();
  Crafty.enterScene("EntityPreview", { entityName, habitat: options.habitat });
};

export const showScenery = async (scenery, backgroundSettings = {}) => {
  await loadSpriteSheets();
  Crafty.enterScene("SceneryPreview", { scenery, ...backgroundSettings });
};

const showBezier = pattern => {
  const vpw = Crafty.viewport.width;
  const vph = Crafty.viewport.height;
  const normalizedPath = pattern.map(({ x, y }) => ({
    x: x * vpw,
    y: y * vph
  }));
  const bezierPath = getBezierPath(normalizedPath);

  for (let t = 0.0; t < 1.0; t += 0.01) {
    const p = bezierPath.get(t);
    Crafty.e("2D, WebGL, Color, BezierPath")
      .attr({ x: p.x, y: p.y, w: 3, h: 3 })
      .color("#00FFFF");
  }
};

Crafty.defineScene("FlyPatternPreview", ({ pattern, showPath, showPoints }) => {
  const vpw = Crafty.viewport.width;
  const vph = Crafty.viewport.height;
  showPoints &&
    pattern.forEach(({ x, y }) => {
      Crafty.e("2D, WebGL, Color, Waypoint")
        .attr({ x: x * vpw, y: y * vph, w: 6, h: 6 })
        .color("#FF0000");
    });

  showPath && showBezier(pattern);

  Crafty.e("2D, WebGL, Color, WayPointMotion")
    .attr({ x: pattern[0].x * vpw, y: pattern[0].y * vph, w: 20, h: 20 })
    .color("#0000FF")
    .flyPattern(pattern, 75, "easeInOutQuad");
});

let currentPattern = null;
export const showFlyPattern = async (pattern, { showPoints, showPath }) => {
  if (pattern === currentPattern && inScene("FlyPatternPreview")) {
    Crafty("Waypoint").destroy();
    Crafty("BezierPath").destroy();

    const vpw = Crafty.viewport.width;
    const vph = Crafty.viewport.height;

    showPoints &&
      pattern.forEach(({ x, y }) => {
        Crafty.e("2D, WebGL, Color, Waypoint")
          .attr({ x: x * vpw, y: y * vph, w: 6, h: 6 })
          .color("#FF0000");
      });

    showPath && showBezier(pattern);
    return;
  }
  currentPattern = pattern;

  Crafty.enterScene("FlyPatternPreview", { pattern, showPoints, showPath });
};

Crafty.defineScene("BackgroundPreview", ({ background }) => {
  setBackground(background, { maxCheckpoint: Infinity });
});

export const showBackground = async background => {
  await loadSpriteSheets();
  if (inScene("BackgroundPreview")) {
    setBackground(background, { maxCheckpoint: Infinity });
    return;
  }
  Crafty.enterScene("BackgroundPreview", { background });
};