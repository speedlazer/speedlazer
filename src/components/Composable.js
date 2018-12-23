const definitionStructure = {
  sprites: []
};

Crafty.c("Composable", {
  init() {},

  compose(proposedDefinition) {
    const definition = {
      ...definitionStructure,
      ...proposedDefinition
    };
    this.buildSprites(definition.sprites);
    return this;
  },

  buildSprites(spriteList) {
    spriteList.forEach(([spriteName, options]) => {
      const subElem = Crafty.e(`2D, WebGL, ${spriteName}`).attr({
        x: this.x + options.x || 0,
        y: this.y + options.y || 0,
        z: this.z + options.z || 0
      });
      this.attach(subElem);
    });
  }
});
