import "src/components/Horizon";
import Scalable from "src/components/utils/Scalable";
import "src/components/utils/HideBelow";
import Animator from "src/components/generic//Animator";
import { tweenFn } from "src/components/generic/TweenPromise";
import { colorFadeFn } from "src/components/generic/ColorFade";
import Delta2D from "src/components/generic/Delta2D";
import Gradient from "src/components/Gradient";
import { globalStartTime } from "src/lib/time";
import { easingFunctions } from "src/constants/easing";

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
  "w",
  "h",
  "rotation",
  "alpha",
  "scale",
  "scaleX",
  "scaleY"
];

const deltaSettings = settings =>
  Object.entries(settings)
    .filter(([name]) => TWEEN_WHITELIST.includes(name))
    .map(([name, value]) =>
      name === "x"
        ? ["dx", value]
        : name === "y"
        ? ["dy", value]
        : [name, value]
    )
    .reduce((result, [key, value]) => ({ ...result, [key]: value }), {});

const generateDefaultFrame = definition => {
  const result = {};
  (definition.sprites || [])
    .filter(([, settings]) => settings.key)
    .map(
      ([, settings]) =>
        (result[settings.key] = {
          z: 0,
          rotation: 0,
          alpha: 1,
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
  result.attributes = definition.attributes;
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

const displayFrameFn = (entity, frameName) => {
  const frameData =
    frameName === "default"
      ? generateDefaultFrame(entity.appliedDefinition)
      : entity.appliedDefinition.frames[frameName];
  if (!frameData) return () => {};

  const fns = Object.entries(frameData).reduce((acc, [keyName, settings]) => {
    if (keyName === "attributes") {
      const tweenSettings = deltaSettings({
        ...settings
      });
      return acc.concat(tweenFn(entity, tweenSettings));
    }
    const sprite = entity.composableParts.find(
      part => part.attr("key") === keyName
    );
    if (sprite) {
      const defaultSettings = {
        z: 0,
        ...(entity.appliedDefinition.sprites.find(
          ([, startSettings]) => startSettings.key === keyName
        ) || [])[1],
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1
      };

      const tweenSettings = deltaSettings({
        ...defaultSettings,
        ...settings
      });
      return acc.concat(tweenFn(sprite, tweenSettings));
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
      return acc.concat(
        tweenFn(gradient, tweenSettings),
        colorFadeFn(gradient, settings.topColor, settings.bottomColor)
      );
    }
  }, []);
  return t => fns.forEach(f => f(t));
};

const Composable = "Composable";

Crafty.c(Composable, {
  required: Animator,

  init() {
    this.appliedDefinition = definitionStructure;
    this.composableParts = [];
    this.gradientParts = [];
    this.currentAttachHooks = {};
    this.currentZ = this.z;
    this.bind("Reorder", this.updateChildrenOrder);
    this.bind("Freeze", this.composableFreeze);
    this.bind("Unfreeze", this.composableUnfreeze);
  },

  composableFreeze() {
    this._children.forEach(child => child.freeze());
  },
  composableUnfreeze() {
    this._children.forEach(child => child.unfreeze());
  },

  compose(proposedDefinition, { autoStartAnimation = true } = {}) {
    const definition = {
      ...definitionStructure,
      ...proposedDefinition
    };

    this.setOwnAttributes(definition.attributes);
    this.buildSprites(definition.sprites);
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

    if (
      definition.animations &&
      definition.animations.default &&
      autoStartAnimation
    ) {
      this.playAnimation("default");
    }
    return this;
  },

  playAnimation(animationName) {
    const animationData =
      this.appliedDefinition.animations &&
      this.appliedDefinition.animations[animationName];
    if (!animationData)
      throw new Error(`Animation ${animationName} not found in playAnimation`);

    console.log("playing", animationName);
    this.activeAnimation = {
      name: animationName,
      data: animationData,
      easing: easingFunctions[animationData.easing || "linear"]
    };

    this.animationStart =
      animationData.timer && animationData.timer === "global"
        ? globalStartTime()
        : new Date() * 1;
    this.bind("EnterFrame", this.updateAnimationFrame);
  },

  animationPlaying() {
    return this.activeAnimation !== null;
  },

  stopAnimation() {
    this.unbind("EnterFrame", this.updateAnimationFrame);
    this.activeAnimation = null;
  },

  updateAnimationFrame({ gameTime }) {
    // When pausing the game is introduced, this will
    // need some special care
    const timeElapsed = gameTime - this.animationStart;
    const timeInIteration = timeElapsed % this.activeAnimation.data.duration;
    const v = this.activeAnimation.easing(
      timeInIteration / this.activeAnimation.data.duration
    );

    console.log("animate!", v);
  },

  updateChildrenOrder() {
    const zDelta = this.z - this.currentZ;

    this.forEachPart(part => {
      part.z += zDelta;
    });

    Object.entries(this.currentAttachHooks).forEach(([, hook]) => {
      hook.z += zDelta;
      hook.currentAttachment && (hook.currentAttachment.z += zDelta);
    });
    this.currentZ = this.z;
  },

  setOwnAttributes(attributes) {
    const attrs = {};
    if (attributes.width) attrs.w = attributes.width;
    if (attributes.height) attrs.h = attributes.height;
    this.attr(attrs);
  },

  buildSprites(spriteList) {
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
            this.createAndAttachSprite(sprite)
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
          this.createAndAttachSprite(sprite)
        );
        currentPointer++;
      } else if (sprite[0] === current[0]) {
        // same sprite
        const toUpdate = this.composableParts[currentPointer];
        this.applySpriteOptions(toUpdate, sprite[1]);
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
        additions.map(spriteData => this.createAndAttachSprite(spriteData))
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
    const subElem = Crafty.e(["2D, WebGL", Gradient, Delta2D].join(", "));
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
  },

  createAndAttachSprite([spriteName, options]) {
    const subElem = Crafty.e(
      ["2D, WebGL", Delta2D, Scalable, spriteName].join(", ")
    );
    this.applySpriteOptions(subElem, options);
    subElem.attr({ originalSize: { w: subElem.w, h: subElem.h } });
    this.attach(subElem);
    return subElem;
  },

  applySpriteOptions(elem, options) {
    elem.attr({
      x: this.x + (options.x || 0),
      y: this.y + (options.y || 0),
      z: this.z + (options.z || 0)
    });
    if (options.key) elem.attr({ key: options.key });
    if (options.crop) {
      // input: Top, Right, Bottom, Left (clockwise)
      // output: left, top, width, height
      const [top, right, bottom, left] = options.crop;
      elem.crop(left, top, elem.w - right - left, elem.h - bottom - top);
    }
    elem.attr({
      w: options.w || elem.w,
      h: options.h || elem.h,
      alpha: options.alpha === undefined ? 1 : options.alpha
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
    if (options.horizon) {
      const [bottom, top] = options.horizon;
      elem.addComponent("Horizon").saturationGradient(bottom, top);
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

  attachEntity(targetHookName, entity) {
    const hookSettings = getHookSettings(
      this.appliedDefinition,
      targetHookName
    );
    const hook = this.currentAttachHooks[targetHookName];
    if (!hook) return;
    if (hook.currentAttachment) {
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
        w: 10,
        h: 10,
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

  async displayFrame(frameName, duration = 0, easing = undefined) {
    const frameData =
      frameName === "default"
        ? generateDefaultFrame(this.appliedDefinition)
        : this.appliedDefinition.frames[frameName];
    if (!frameData) return;

    const frameFunc = displayFrameFn(this, frameName);
    return this.animate(frameFunc, duration, easing);
  }
});

export default Composable;
