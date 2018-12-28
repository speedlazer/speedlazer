const definitionStructure = {
  sprites: [],
  attachHooks: [],
  attributes: {},
  hitbox: []
};

Crafty.c("Composable", {
  init() {
    this.appliedDefinition = definitionStructure;
    this.composableParts = [];
  },

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

    this.appliedDefinition = definition;
    return this;
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
    const subElem = Crafty.e(`2D, WebGL, ${spriteName}`);
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

    if (options.flipX) elem.flip("X");
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
