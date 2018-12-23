const definitionStructure = {
  sprites: [],
  attachHooks: []
};

Crafty.c("Composable", {
  init() {},

  compose(proposedDefinition) {
    const definition = {
      ...definitionStructure,
      ...proposedDefinition
    };
    this.buildSprites(definition.sprites);
    this.buildAttachHooks(definition.attachHooks);
    return this;
  },

  buildSprites(spriteList) {
    spriteList.forEach(([spriteName, options]) => {
      const subElem = Crafty.e(`2D, WebGL, ${spriteName}`).attr({
        x: this.x + (options.x || 0),
        y: this.y + (options.y || 0),
        z: this.z + (options.z || 0)
      });
      if (options.flipX) subElem.flip("X");
      this.attach(subElem);
    });
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
