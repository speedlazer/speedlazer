import Horizon from "src/components/Horizon";
import Scalable from "src/components/utils/Scalable";
import "src/components/utils/HideBelow";
import Animator from "src/components/generic/Animator";
import { tweenFn } from "src/components/generic/TweenPromise";
import { colorFadeFn } from "src/components/generic/ColorFade";
import Delta2D from "src/components/generic/Delta2D";
import Gradient from "src/components/Gradient";
import ColorEffects from "src/components/ColorEffects";
import Flipable from "src/components/utils/flipable";
import { Stretchable, Stretcher } from "src/components/utils/Stretchable";
import { globalStartTime } from "src/lib/time";
import { easingFunctions } from "src/constants/easing";
import { convertColor } from "src/lib/color";

const definitionStructure = {
  sprites: [],
  gradients: [],
  attachHooks: [],
  attributes: {},
  frames: {},
  animations: {},
  hitbox: []
};

const heightFactor = {
  top: 0,
  center: 0.5,
  bottom: 1
};

const widthFactor = {
  left: 0,
  center: 0.5,
  right: 1
};

const TWEEN_WHITELIST = [
  "x",
  "y",
  "z",
  "w",
  "h",
  "rx",
  "ry",
  "rotation",
  "alpha",
  "maxAlpha",
  "overrideColor",
  "overrideColorStrength",
  "horizon",
  "scale",
  "scaleX",
  "scaleY"
];

const entityDeltaSettings = entity => settings =>
  Object.entries(settings)
    .filter(([name]) => TWEEN_WHITELIST.includes(name))
    .reduce((result, [key, value]) => {
      switch (key) {
        case "x":
          result["dx"] = entity.xFlipped ? -value : value;
          break;
        case "y":
          result["dy"] = value;
          break;
        case "z":
          result["z"] = entity.z + value;
          break;
        case "rx":
          result["drx"] = entity.xFlipped ? -value : value;
          break;
        case "ry":
          result["dry"] = value;
          break;
        case "w":
          result["sw"] = value;
          break;
        case "overrideColor": {
          if (value === null) {
            result["overrideColorStrength"] = 0.0;
          } else {
            result["overrideColor"] = convertColor(value);
            result["overrideColorStrength"] = 1.0;
          }
          break;
        }
        case "horizon":
          result["topDesaturation"] = value[1];
          result["bottomDesaturation"] = value[0];
          break;
        default:
          result[key] = value;
      }
      return result;
    }, {});

const orDefault = (v, def) => (v === undefined ? def : v);

const generateDefaultFrame = (entity, definition) => {
  const result = {};
  (definition.sprites || [])
    .filter(([, settings]) => settings.key)
    .map(
      ([sprite, settings]) =>
        (result[settings.key] = {
          z: 0,
          rotation: 0,
          alpha: 1,
          scale: 1,
          topDesaturation: 0,
          bottomDesaturation: 0,
          overrideColorStrength: 0,
          sprite,
          ...settings,
          x: 0,
          y: 0
        })
    );
  (definition.gradients || [])
    .filter(settings => settings.key)
    .map(
      settings =>
        (result[settings.key] = {
          z: 0,
          rotation: 0,
          ...settings,
          x: 0,
          y: 0
        })
    );

  result.attributes = {
    w: definition.attributes.width,
    h: definition.attributes.height,
    rotation: orDefault(definition.attributes.rotation, 0),
    scale: orDefault(definition.attributes.scale, 1)
  };
  if (entity.xFlipped === true) {
    result.flipX = true;
  }
  return result;
};

const getSpriteByKey = (entity, key) => {
  let index = null;
  entity.appliedDefinition.sprites.forEach((def, idx) => {
    if (def[1].key === key) index = idx;
  });
  if (index === null) return null;
  return entity.composableParts[index];
};

const getHookSettings = (definition, name) =>
  (definition.attachHooks.find(([hookName]) => hookName === name) || [])[1] ||
  {};

const getFrameData = (entity, frameName) =>
  frameName === "default"
    ? generateDefaultFrame(entity, entity.appliedDefinition)
    : frameName && entity.appliedDefinition.frames[frameName];

const displayFrameFn = (entity, targetFrame, sourceFrame = undefined) => {
  const targetFrameData = getFrameData(entity, targetFrame);
  if (!targetFrameData) return () => {};
  const sourceFrameData = getFrameData(entity, sourceFrame);
  const deltaSettings = entityDeltaSettings(entity);

  const fns = Object.entries(targetFrameData)
    .reduce((acc, [keyName, settings]) => {
      if (keyName === "attributes") {
        const fixedSettings = {};
        if (entity.scale !== undefined || settings.scale !== undefined) {
          if (settings.w) {
            fixedSettings.w = settings.w * (settings.scale || entity.scale);
          }
          if (settings.h) {
            fixedSettings.h = settings.h * (settings.scale || entity.scale);
          }
        }
        const tweenSettings = deltaSettings({
          ...settings,
          ...fixedSettings
        });

        if (tweenSettings.sw !== undefined) {
          entity.addComponent(Stretchable);
        }
        const sourceTweenSettings =
          sourceFrameData &&
          deltaSettings({
            ...sourceFrameData[keyName]
          });

        return acc.concat(tweenFn(entity, tweenSettings, sourceTweenSettings));
      }
      if (keyName === "flipX") {
        entity.addComponent(Flipable);
        const xFlipped = entity.xFlipped;
        return acc.concat(() => {
          if (xFlipped === entity.xFlipped) {
            entity.xFlipped ? entity.unflipX() : entity.flipX();
          }
        });
      }
      const sprite = entity.composableParts.find(
        part => part.attr("key") === keyName
      );
      if (sprite) {
        const originalSettings = entity.appliedDefinition.sprites.find(
          ([, startSettings]) => startSettings.key === keyName
        );

        const defaultSettings = {
          z: 0,
          alpha: 1,
          scaleX: 1,
          scaleY: 1,
          horizon: [0, 0],
          overrideColorStrength: 0.0,
          ...(originalSettings && originalSettings[1]),
          x: 0,
          y: 0
        };
        if (defaultSettings.w && entity.scale !== undefined) {
          defaultSettings.w = defaultSettings.w * entity.scale;
        }
        if (defaultSettings.h && entity.scale !== undefined) {
          defaultSettings.h = defaultSettings.h * entity.scale;
        }

        const tweenSettings = deltaSettings({
          ...defaultSettings,
          ...settings,
          ...(settings.rotation !== undefined && {
            rotation: sprite._parent.rotation + settings.rotation
          })
        });
        const sourceTweenSettings =
          sourceFrameData &&
          deltaSettings({
            ...defaultSettings,
            ...sourceFrameData[keyName]
          });

        if (tweenSettings.overrideColor) {
          sprite.addComponent(ColorEffects);
          sprite["overrideColorMode"] = "all";
        }

        if (tweenSettings.topDesaturation !== 0) {
          sprite.addComponent(Horizon);
        }

        const newSpriteName = settings.sprite;

        return acc.concat([
          tweenFn(sprite, tweenSettings, sourceTweenSettings),
          newSpriteName &&
            (() => {
              if (sprite._spriteName === newSpriteName) return;
              sprite.sprite(newSpriteName);
              sprite._spriteName = newSpriteName;
            })
        ]);
      }

      const gradient = entity.gradientParts.find(
        part => part.attr("key") === keyName
      );
      if (gradient) {
        const defaultSettings = {
          z: 0,
          w: gradient.originalSize.w,
          h: gradient.originalSize.h,
          ...(entity.appliedDefinition.gradients.find(
            startSettings => startSettings.key === keyName
          ) || {}),
          x: 0,
          y: 0
        };

        const tweenSettings = deltaSettings({
          ...defaultSettings,
          ...settings
        });
        const sourceTweenSettings =
          sourceFrameData &&
          deltaSettings({
            ...defaultSettings,
            ...sourceFrameData[keyName]
          });

        return acc.concat(
          tweenFn(gradient, tweenSettings, sourceTweenSettings),
          colorFadeFn(gradient, settings.topColor, settings.bottomColor)
        );
      }

      const hook = entity.currentAttachHooks[keyName];
      if (hook) {
        hook.addComponent(Delta2D);
        const defaultSettings = {
          x: 0,
          y: 0
        };
        const tweenSettings = deltaSettings({
          ...defaultSettings,
          ...settings
        });
        return acc.concat([tweenFn(hook, tweenSettings)]);
      }
      return acc;
    }, [])
    .filter(Boolean);
  return t => fns.forEach(f => f(t));
};

const displaySpriteAnimationFn = (entity, animationDefinition) => {
  const sprite = entity.composableParts.find(
    part => part.attr("key") === animationDefinition.key
  );
  if (!sprite) {
    return () => {};
  }
  return t => {
    const spriteIndex = Math.min(
      Math.floor(t * animationDefinition.sprites.length),
      animationDefinition.sprites.length - 1
    );
    const name = animationDefinition.sprites[spriteIndex];
    sprite.sprite(name);
    sprite._spriteName = name;
  };
};

const Composable = "Composable";

Crafty.c(Composable, {
  required: Animator,

  events: {
    Reorder() {
      const zDelta = this.z - this.currentZ;

      this.forEachPart(part => {
        part.z += zDelta;
      });

      Object.values(this.currentAttachHooks).forEach(hook => {
        hook.z += zDelta;
        hook.currentAttachment && (hook.currentAttachment.z += zDelta);
      });
      this.currentZ = this.z;
    },
    Freeze() {
      this.stopAnimation();
      this._children.forEach(child => child.freeze && child.freeze());
    },
    Unfreeze() {
      this._children.forEach(child => child.unfreeze && child.unfreeze());
      if (this.getAnimation("default")) {
        this.playAnimation("default");
      } else {
        this.displayFrame("default");
      }
    }
  },

  init() {
    this.appliedDefinition = definitionStructure;
    this.composableParts = [];
    this.collisionComponents = [];
    this.gradientParts = [];
    this.currentAttachHooks = {};
    this.currentZ = this.z;
    this.animationListeners = [];
    this.displayFrame = this.displayFrame.bind(this);
    this.playAnimation = this.playAnimation.bind(this);
  },

  compose(proposedDefinition, { autoStartAnimation = true } = {}) {
    if (this.appliedDefinition === proposedDefinition) {
      return;
    }
    const definition = {
      ...definitionStructure,
      ...proposedDefinition
    };

    this.setOwnAttributes(definition.attributes);
    this.buildSprites(definition.sprites, definition.spriteAttributes);
    this.buildGradients(definition.gradients);
    this.appliedDefinition = proposedDefinition;

    this.forEachPart((entity, index) => {
      const definition = this.spriteOptions(index);
      if (!definition.attachTo) return;
      const attachTarget = getSpriteByKey(this, definition.attachTo);
      attachTarget && attachTarget.attach(entity);
    });

    this.buildAttachHooks(definition.attachHooks);
    if (definition.hitbox.length > 0) {
      this.addComponent("Collision");
      this.collision(definition.hitbox);
    }

    if (definition.attributes.scale) {
      this.addComponent(Scalable);
      this.attr({
        scale: definition.attributes.scale
      });
    }

    if (this.getAnimation("default") && autoStartAnimation) {
      this.playAnimation("default");
    }
    return this;
  },

  getAnimation(animationName) {
    return (
      this.appliedDefinition.animations &&
      this.appliedDefinition.animations[animationName]
    );
  },

  async playAnimation(animationName) {
    const animationData = this.getAnimation(animationName);
    if (!animationData)
      throw new Error(`Animation ${animationName} not found in playAnimation`);

    if (animationData.startEase) {
      const firstFrame = animationData.timeline[0].startFrame;
      await this.displayFrame(
        firstFrame,
        animationData.startEase.duration,
        animationData.startEase.easing
      );
    }

    this.activeAnimation = {
      name: animationName,
      data: animationData,
      easing: easingFunctions[animationData.easing || "linear"],
      timeline: animationData.timeline.map(e => ({ ...e }))
    };

    this.animationStart =
      animationData.timer && animationData.timer === "global"
        ? globalStartTime()
        : new Date() * 1;
    this.bind("EnterFrame", this.updateAnimationFrame);
    await new Promise(resolve => this.animationListeners.push(resolve));
  },

  animationPlaying() {
    return this.activeAnimation !== null;
  },

  stopAnimation() {
    this.unbind("EnterFrame", this.updateAnimationFrame);
    this.activeAnimation = null;
    this.animationListeners.forEach(listener => listener());
    this.animationListeners = [];
  },

  updateAnimationFrame({ gameTime }) {
    // When pausing the game is introduced, this will
    // need some special care
    if (gameTime < this.animationStart) this.animationStart = gameTime;
    const timeElapsed = gameTime - this.animationStart;
    const timeInIteration = this.activeAnimation.data.repeat
      ? timeElapsed % this.activeAnimation.data.duration
      : timeElapsed;
    const t = timeInIteration / this.activeAnimation.data.duration;
    const v = this.activeAnimation.easing(t);

    this.activeAnimation.timeline.forEach(event => {
      if (event.start > v || v > event.end) return;
      if (!event.animateFn)
        event.animateFn =
          (event.startFrame &&
            event.endFrame &&
            displayFrameFn(this, event.endFrame, event.startFrame)) ||
          (event.spriteAnimation &&
            displaySpriteAnimationFn(this, event.spriteAnimation)) ||
          (() => {});

      const localV = (v - event.start) / (event.end - event.start);
      event.animateFn(localV);
    });
    if (t >= 1.0 && !this.activeAnimation.data.repeat) {
      const after = this.activeAnimation.data.after;
      this.stopAnimation();
      if (after && after.animation) {
        this.playAnimation(after.animation);
      }
    }
  },

  setOwnAttributes(attributes) {
    if (!attributes) return;
    const attrs = {};
    if (attributes.width) attrs.w = attributes.width;
    if (attributes.height) attrs.h = attributes.height;
    if (attributes.ro) {
      const [rx, ry] = attributes.ro;
      this.origin(rx, ry);
    }
    this.attr(attrs);
  },

  buildSprites(spriteList, spriteAttributes) {
    const additions = [];

    const currentlyApplied = this.appliedDefinition.sprites;
    let currentPointer = 0;
    spriteList.forEach((sprite, index, list) => {
      const current = currentlyApplied[currentPointer];
      if (!current) {
        additions.push(sprite);
      } else if (sprite[0] !== current[0]) {
        // replace
        const nextSprite = list[index + 1];
        if (nextSprite && nextSprite[0] === current[0]) {
          // maybe we are inserted.
          this.composableParts.splice(
            currentPointer,
            0,
            this.createAndAttachSprite(sprite, spriteAttributes)
          );
          currentPointer++;
          return;
        }

        // clear old
        const toReplace = this.composableParts[currentPointer];
        this.detach(toReplace);
        toReplace.destroy();
        this.composableParts.splice(
          currentPointer,
          1,
          this.createAndAttachSprite(sprite, spriteAttributes)
        );
        currentPointer++;
      } else if (sprite[0] === current[0]) {
        // same sprite
        const toUpdate = this.composableParts[currentPointer];
        this.applySpriteOptions(toUpdate, {
          ...spriteAttributes,
          ...sprite[1]
        });
        currentPointer++;
      }
    });
    const deletions = this.composableParts.slice(currentPointer);
    deletions.forEach(deletion => {
      this.detach(deletion);
      deletion.destroy();
    });

    this.composableParts = this.composableParts
      .slice(0, currentPointer)
      .concat(
        additions.map(spriteData =>
          this.createAndAttachSprite(spriteData, spriteAttributes)
        )
      );
  },

  buildGradients(gradientList) {
    const additions = [];

    const currentlyApplied = this.appliedDefinition.gradients;
    let currentPointer = 0;
    gradientList.forEach(gradient => {
      const current = currentlyApplied[currentPointer];
      if (!current) {
        additions.push(gradient);
      } else {
        const toUpdate = this.composableParts[currentPointer];
        this.applySpriteOptions(toUpdate, gradient);
        currentPointer++;
      }
    });
    const deletions = this.gradientParts.slice(currentPointer);
    deletions.forEach(deletion => {
      this.detach(deletion);
      deletion.destroy();
    });
    this.gradientParts = this.gradientParts
      .slice(0, currentPointer)
      .concat(
        additions.map(gradientData =>
          this.createAndAttachGradient(gradientData)
        )
      );
  },

  createAndAttachGradient(options) {
    const renderLayer = this._drawLayer ? this._drawLayer.name : "WebGL";
    const subElem = Crafty.e([renderLayer, "2D", Gradient, Delta2D].join(", "));
    this.applyGradientOptions(subElem, options);
    subElem.attr({ originalSize: { w: subElem.w, h: subElem.h } });
    this.attach(subElem);
    return subElem;
  },

  applyGradientOptions(elem, options) {
    elem.attr({
      x: this.x + (options.x || 0),
      y: this.y + (options.y || 0),
      z: this.z + (options.z || 0)
    });
    if (options.key) elem.attr({ key: options.key });
    elem.attr({
      w: options.w || elem.w,
      h: options.h || elem.h,
      alpha: options.alpha === undefined ? 1 : options.alpha
    });
    if (options.topColor)
      elem.topColor(options.topColor[0], options.topColor[1]);
    if (options.bottomColor)
      elem.bottomColor(options.bottomColor[0], options.bottomColor[1]);

    if (options.ro) {
      const [rx, ry] = options.ro;
      elem.origin(rx, ry);
      if (options.rotation) elem.attr({ rotation: options.rotation });
    }
    if (options.hitbox) {
      elem.addComponent("Collision");
      elem.collision(options.hitbox);
    }
    if (options.hideBelow) {
      elem.addComponent("HideBelow").attr({
        hideBelow: options.hideBelow
      });
    }
    if (options.hideAbove) {
      elem.addComponent("HideBelow").attr({
        hideAbove: options.hideAbove
      });
    }
  },

  createAndAttachSprite([spriteName, options], spriteAttributes) {
    const renderLayer = this._drawLayer ? this._drawLayer.name : "WebGL";
    const subElem = Crafty.e(
      [renderLayer, "2D", Delta2D, Scalable, spriteName].join(", ")
    );
    const opts = { ...spriteAttributes, ...options };
    this.applySpriteOptions(subElem, opts);
    subElem.attr({ originalSize: { w: subElem.w, h: subElem.h } });
    subElem.root = this;
    this.attach(subElem);
    if (opts.stretch) {
      subElem.activateStretch(this);
    }

    return subElem;
  },

  applySpriteOptions(elem, options) {
    elem.attr({
      x: this.x + (options.x || 0),
      y: this.y + (options.y || 0),
      z: this.z + (options.z || 0)
    });
    if (options.key) elem.attr({ key: options.key });
    if (options.scale) elem.attr({ scale: options.scale });
    if (options.scaleX) elem.attr({ scale: options.scaleX });
    if (options.scaleY) elem.attr({ scale: options.scaleY });
    if (options.stretch) {
      elem.addComponent(Stretcher);
      elem.attr({ stretch: options.stretch });
    }
    if (options.overrideColor) {
      elem.addComponent(ColorEffects);
      elem.colorOverride(options.overrideColor);
    }
    if (options.accentColor) {
      elem.addComponent(ColorEffects);
      elem.colorOverride(options.accentColor, "partial");
    }
    if (options.lightness) {
      elem.addComponent(ColorEffects);
      elem.attr({ lightness: options.lightness });
    }
    if (options.crop) {
      // input: Top, Right, Bottom, Left (clockwise)
      // output: left, top, width, height
      const [top, right, bottom, left] = options.crop;
      elem.crop(left, top, elem.w - right - left, elem.h - bottom - top);
    }
    elem.attr({
      w: options.w || elem.w,
      h: options.h || elem.h,
      alpha: options.alpha === undefined ? 1 : options.alpha,
      maxAlpha: options.maxAlpha === undefined ? 1 : options.maxAlpha
    });
    if (options.flipX) elem.flip("X");
    if (options.ro) {
      const [rx, ry] = options.ro;
      elem.origin(rx, ry);
      if (options.rotation) elem.attr({ rotation: options.rotation });
    }
    if (options.hitbox) {
      elem.addComponent("Collision");
      elem.collision(options.hitbox);
    }
    if (options.hideBelow) {
      elem.addComponent("HideBelow").attr({
        hideBelow: options.hideBelow
      });
    }
    if (options.hideAbove) {
      elem.addComponent("HideBelow").attr({
        hideAbove: options.hideAbove
      });
    }
    if (options.horizon) {
      const [bottom, top] = options.horizon;
      elem.addComponent(Horizon).saturationGradient(bottom, top);
    }
  },

  forEachPart(callback) {
    this.composableParts.forEach((elem, idx, list) =>
      callback(elem, idx, list)
    );
  },

  spriteOptions(index) {
    return this.appliedDefinition.sprites[index][1];
  },

  attachHookSettings(targetHookName) {
    return getHookSettings(this.appliedDefinition, targetHookName);
  },

  attachEntity(targetHookName, entity) {
    const hookSettings = this.attachHookSettings(targetHookName);
    const hook = this.currentAttachHooks[targetHookName];
    if (!hook) return;
    if (hook.currentAttachment && hook.currentAttachment !== entity) {
      hook.currentAttachment.destroy();
    }

    if (!entity) {
      hook.attr({ currentAttachment: null });
      return;
    }

    const alignment = hookSettings.attachAlign || ["top", "left"];

    const targetX = hook.x - widthFactor[alignment[1]] * entity.w;
    const targetY = hook.y - heightFactor[alignment[0]] * entity.h;
    entity.attr({ x: targetX, y: targetY, z: hook.z });
    entity.detachFromParent = () => {
      hook.detach(entity);
      hook.attr({ currentAttachment: null });
    };
    hook.attach(entity);
    hook.attr({ currentAttachment: entity });
  },

  clearAttachment(targetHookName) {
    this.attachEntity(targetHookName, null);
  },

  buildAttachHooks(attachHooks) {
    attachHooks.forEach(([label, options]) => {
      const hook = this.currentAttachHooks[label] || Crafty.e("2D");
      hook.attr({
        x: this.x + (options.x || 0),
        y: this.y + (options.y || 0),
        z: this.z + (options.z || 0),
        w: 1,
        h: 1,
        currentAttachment: hook.currentAttachment || null
      });
      if (options.attachTo) {
        const elem = getSpriteByKey(this, options.attachTo);
        elem ? elem.attach(hook) : this.attach(hook);
      } else {
        this.attach(hook);
      }
      this.currentAttachHooks[label] = hook;
    });
  },

  getElementByKey(key) {
    return getSpriteByKey(this, key);
  },

  addCollisionComponent(c, passthrough = []) {
    this.collisionComponents.push(c);
    if (this.has("Collision") || passthrough.length > 0) {
      this.addComponent(c);
    }
    this.composableParts.forEach(
      p =>
        p.has("Collision") &&
        (passthrough.length > 0
          ? passthrough.forEach(
              fName =>
                (p[fName] = function(...args) {
                  this.root[fName](...args);
                })
            )
          : p.addComponent(c))
    );

    return this;
  },

  clearCollisionComponents() {
    this.collisionComponents.forEach(c => this.removeComponent(c));
    this.composableParts.forEach(p =>
      this.collisionComponents.forEach(c => p.removeComponent(c))
    );
    this.collisionComponents = [];
    return this;
  },

  async displayFrame(frameName, duration = 0, easing = undefined) {
    const frameData = getFrameData(this, frameName);
    if (!frameData) return;

    const frameFunc = displayFrameFn(this, frameName);
    return this.animate(frameFunc, duration, easing);
  }
});

export default Composable;
