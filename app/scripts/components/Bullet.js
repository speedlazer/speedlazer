'use strict';

Crafty.c('Bullet', {
  init: function () {
    this.addComponent('2D, Canvas, Color, Collision');
  },
  fire: function (properties) {
    this.attr({
      damage: properties.damage
    })
      .bind('EnterFrame', function () {
        this.x = this.x + properties.speed;

        var maxX = (-Crafty.viewport._x + (Crafty.viewport._width / Crafty.viewport._scale));
        if (this.x > maxX + 200) {
          // Maybe send a bullet miss event
          this.destroy();
        }
      })
      .onHit('Edge', function () {
        this.destroy();
      });
    return this;
  }
});
