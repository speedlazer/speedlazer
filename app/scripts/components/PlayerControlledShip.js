'use strict';

Crafty.c('PlayerControlledShip', {
  init: function () {
    this.addComponent('2D, Canvas, Color, Collision');
    this.attr({ w: 30, h: 30, lives: 1, points: 0 })
      .bind('Moved', function (from) {
        if (this.hit('Edge')) { // Contain player within playfield
          this.attr({x: from.x, y: from.y});
        }
      })
      .onHit('Enemy', function () {
        this.trigger('Hit');
      });
  },
  shoot: function () {
    var _this = this;
    Crafty.e('Bullet')
      .color(this.color())
      .attr({
        x: this.x + this.w,
        y: this.y + (this.h / 2.0),
        w: 5,
        h: 5
      })
      .fire({
        origin: this,
        damage: 100,
        speed: 4,
        direction: 0
      })
      .bind('HitTarget', function () {
        _this.trigger('BulletHit');
      })
      .bind('DestroyTarget', function () {
        _this.trigger('BulletDestroyedTarget');
      });
  },
});
