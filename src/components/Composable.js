import "src/components/utils/Scalable";
import "src/components/utils/HideBelow";
import "src/components/generic/TweenPromise";
import "src/components/generic/Delta2D";

const definitionStructure = {
  sprites: [],
  attachHooks: [],
  attributes: {},
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

const TWEEN_WHITELIST = ["x", "y", "z", "rotation"];

const deltaSettings = settings =>
  Object.entries(settings)
    .filter(([name]) => TWEEN_WHITELIST.includes(name))
    .map(([name, value]) => {
      if (name === "x") {
        return ["dx", value];
      } else if (name === "y") {
        return ["dy", value];
      } else if (name === "z") {
        return [name, value];
      } else {
        return [name, value];
      }
    })
    .reduce((result, [key, value]) => ({ ...result, [key]: value }), {});

const generateDefaultFrame = definition => {
  const result = {};
  definition.sprites.filter(([, settings]) => settings.key).map(
    ([, settings]) =>
      (result[settings.key] = {
        z: 0,
        rotation: 0,
        ...settings,
        x: 0,
        y: 0
      })
  );
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

Crafty.c("Composable", {
  init() {
    this.appliedDefinition = definitionStructure;
    this.composableParts = [];
    this.currentAttachHooks = {};
    this.currentZ = this.z;
    this.bind("Reorder", this.updateChildrenOrder);
  },

  compose(proposedDefinition) {
    const definition = {
      ...definitionStructure,
      ...proposedDefinition
    };

    this.setOwnAttributes(definition.attributes);
    this.buildSprites(definition.sprites);
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
      this.addComponent("Scalable");
      this.attr({
        scale: definition.attributes.scale
      });
    }
    return this;
  },

  updateChildrenOrder() {
    const newZ = this.z;
    this.forEachPart(part => {
      const zDelta = part.z - this.currentZ;
      part.z = newZ + zDelta;
    });
    this.currentZ = newZ;
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

  createAndAttachSprite([spriteName, options]) {
    const subElem = Crafty.e(`2D, WebGL, Delta2D, ${spriteName}`);
    this.applySpriteOptions(subElem, options);
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
    if (options.flipX) elem.flip("X");
    if (options.ro) {
      const [rx, ry] = options.ro;
      elem.origin(rx, ry);
      if (options.rotation) elem.attr({ rotation: options.rotation });
    }
    if (options.hideBelow) {
      elem.addComponent("HideBelow").attr({
        hideBelow: options.hideBelow
      });
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
    const hookSettings =
      (this.appliedDefinition.attachHooks.find(
        ([hookName]) => hookName === targetHookName
      ) || [])[1] || {};
    const hook = this.currentAttachHooks[targetHookName];
    if (!hook) return;
    const alignment = hookSettings.attachAlign || ["top", "left"];

    const targetX = hook.x - widthFactor[alignment[1]] * entity.w;
    const targetY = hook.y - heightFactor[alignment[0]] * entity.h;
    entity.attr({ x: targetX, y: targetY, z: this.z + hook.z });
    this.attach(entity);
  },

  buildAttachHooks(attachHooks) {
    attachHooks.forEach(([label, options]) => {
      const hook = this.currentAttachHooks[label] || Crafty.e(`2D, ${label}`);
      hook.attr({
        x: this.x + (options.x || 0),
        y: this.y + (options.y || 0),
        z: this.z + (options.z || 0),
        w: 10,
        h: 10
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

  async displayFrame(frameName, duration, easing = undefined) {
    const frameData =
      frameName === "default"
        ? generateDefaultFrame(this.appliedDefinition)
        : this.appliedDefinition.frames[frameName];
    if (!frameData) return;

    const promises = Object.entries(frameData).map(([keyName, settings]) => {
      const defaultSettings = {
        z: 0,
        ...(this.appliedDefinition.sprites.find(
          ([, startSettings]) => startSettings.key === keyName
        ) || [])[1],
        x: 0,
        y: 0
      };

      const sprite = this.composableParts.find(
        part => part.attr("key") === keyName
      );
      if (!sprite || !defaultSettings) return;
      sprite.addComponent("TweenPromise");
      const tweenSettings = deltaSettings({ ...defaultSettings, ...settings });
      sprite.tweenPromise(tweenSettings, duration, easing);
    });
    await Promise.all(promises);
  }
});
