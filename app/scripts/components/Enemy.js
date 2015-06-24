'use strict';

Crafty.c('Enemy', {
  init: function () {
    this.addComponent('2D, Canvas, Color, Collision');
  },
  enemy: function () {
    this.attr({ w: 50, h: 50, health: 300 })
      .color('#0000FF')
      .bind('EnterFrame', function () {
        this.x = this.x - 2;
        var minX = (-Crafty.viewport._x);
        if (this.x < minX) {
          this.destroy();
        }
      })
      .onHit('Bullet', function (e) {
        var bullet = e[0].obj;
        bullet.trigger('HitTarget', { target: this });
        this.health -= bullet.damage;
        if (this.health <= 0) {
          bullet.trigger('DestroyTarget', { target: this });
          this.destroy();
        }
        bullet.destroy();
      });
    return this;
  }
});


