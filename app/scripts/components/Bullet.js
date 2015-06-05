'use strict';

Crafty.c('Bullet', {
  init: function () {
    this.addComponent('2D, Canvas, Color');
  },
  fire: function (properties) {
    this.attr({
      damage: properties.damage
    })
    .bind('EnterFrame', function () {
      this.x = this.x + properties.speed;
      if (this.x > 1200) { // TODO: Refactor to end of playfield
        // Maybe send a bullet miss event
        this.destroy();
      }
    })
    .bind('HitTarget', function (e) {
      properties.origin.trigger('BulletHit', {
        bullet: this,
        target: e.target
      });
    })
    .bind('DestroyTarget', function (e) {
      properties.origin.trigger('BulletDestroy', {
        bullet: this,
        target: e.target
      });
    });
  }
});
