const definitionStructure = {
  sprites: [],
  attachHooks: [],
  attributes: {},
  hitbox: []
};

Crafty.c("Composable", {
  init() {},

  compose(proposedDefinition) {
    const definition = {
      ...definitionStructure,
      ...proposedDefinition
    };
    this.setOwnAttributes(definition.attributes);
    this.buildSprites(definition.sprites);
    this.buildAttachHooks(definition.attachHooks);
    if (definition.hitbox.length > 0) {
      this.addComponent("Collision");
      this.collision(definition.hitbox);
    }
    return this;
  },

  setOwnAttributes(attributes) {
    const attrs = {};
    if (attributes.width) attrs.w = attributes.width;
    if (attributes.height) attrs.h = attributes.height;
    this.attr(attrs);
  },

  buildSprites(spriteList) {
    this.composableParts = spriteList.map(([spriteName, options]) => {
      const subElem = Crafty.e(`2D, WebGL, ${spriteName}`).attr({
        x: this.x + (options.x || 0),
        y: this.y + (options.y || 0),
        z: this.z + (options.z || 0)
      });
      if (options.flipX) subElem.flip("X");
      this.attach(subElem);
      return subElem;
    });
  },

  forEachPart(callback) {
    this.composableParts.forEach((elem, idx, list) =>
      callback(elem, idx, list)
    );
  },

  buildAttachHooks(attachHooks) {
    attachHooks.forEach(([label, options]) => {
      const hook = Crafty.e(`2D, ${label}`).attr({
        x: this.x + (options.x || 0),
        y: this.y + (options.y || 0),
        z: this.z + (options.z || 0)
      });
      this.attach(hook);
    });
  }
});
