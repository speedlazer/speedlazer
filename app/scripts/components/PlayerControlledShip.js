'use strict';

Crafty.c('PlayerControlledShip', {
  init: function () {
    this.requires('2D, Canvas, Color, Collision, Delay');
    this.attr({ w: 30, h: 30 })
      .bind('Moved', function (from) {
        if (this.hit('Edge')) { // Contain player within playfield
          this.attr({x: from.x, y: from.y});
        }
      });
    this._forcedSpeed = { x: 0, y: 0 };

    this.delay(function () {
      this.addComponent('Invincible').invincibleDuration(2000);
      this.onHit('Enemy', function () {
        if (this.has('Invincible')) {
          return;
        }
        this.trigger('Hit');
      });
    }, 10, 0);
    this.bind('EnterFrame', function () {

      this.x += this._forcedSpeed.x;
      if (this.hit('Edge')) {
        this.x -= this._forcedSpeed.x;
      }

      if (this.hit('Edge')) {
        this.trigger('Hit');
      }
    });
  },
  forcedSpeed: function (speed) {
    if (speed.x !== undefined && speed.y !== undefined) {
      this._forcedSpeed.x = speed.x;
      this._forcedSpeed.y = speed.y;
    } else {
      this._forcedSpeed.x = speed;
      this._forcedSpeed.y = speed;
    }
    return this;
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
        speed: this._forcedSpeed.x + 3,
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
