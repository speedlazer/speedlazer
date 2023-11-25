import Crafty from "../crafty";

Crafty.c("DebugComposable", {
  init() {},

  displayHitBoxes(show = true) {
    if (!this.appliedDefinition) return;
    if (this.appliedDefinition.hitbox) {
      show
        ? this.addComponent("SolidHitBox")
        : this.removeComponent("SolidHitBox");
    }
    this.forEachPart(entity => {
      if (entity.has("Collision")) {
        show
          ? entity.addComponent("SolidHitBox")
          : entity.removeComponent("SolidHitBox");
      }
    });
  },

  displayRotationPoints(show = true) {
    if (!this.appliedDefinition) return;
    Crafty("DebugRotationPoint").destroy();
    if (!show) return;
    if (
      this.appliedDefinition.attributes &&
      this.appliedDefinition.attributes.ro
    ) {
      const ro = this.appliedDefinition.attributes.ro;
      const point = Crafty.e("2D, WebGL, Color, DebugRotationPoint")
        .attr({
          x: this.x + ro[0] - 1,
          y: this.y + ro[1] - 1,
          w: 2,
          h: 2,
          z: 10000
        })
        .color("#FFFF00");
      this.attach(point);
    }

    this.forEachPart((entity, index) => {
      const definition = this.spriteOptions(index);
      if (definition.ro) {
        const point = Crafty.e("2D, WebGL, Color, DebugRotationPoint")
          .attr({
            x: entity.x + definition.ro[0] - 1,
            y: entity.y + definition.ro[1] - 1,
            w: 2,
            h: 2,
            z: 10000
          })
          .color("#FFFF00");
        entity.attach(point);
      }
    });
  }
});
