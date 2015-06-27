'use strict';

Crafty.c('ScrollWall', {
  init: function () {
    this.requires('2D, Canvas, Color, Edge, Collision');
    this.attr({ x: 0, y: 50, w: 2, h: 710, speed: { x: 0, y: 0 } });
    this.color('#FFFF00');
    this._speed = { x: 0, y: 0 };
    this.wallEnd = Crafty.e('2D, Canvas, Color, ScrollFront')
      .attr({ x: - (Crafty.viewport.x - Crafty.viewport.width) - 3, y: 40, h: 710, w: 2 })
      .color('#FFFF00');

    this.bind('Remove', function () {
      this.wallEnd.destroy();
    });

    this.bind('EnterFrame', function () {
      var speedX = this._speed.x;
      Crafty('PlayerControlledShip').each(function () {
        var margin = Crafty.viewport.width / 3.0;
        if (this.x >  (- (Crafty.viewport.x - Crafty.viewport.width)) - margin) {
          speedX += 2;
        }
      });
      this.x += speedX;
      this.wallEnd.x += speedX;
      Crafty.viewport.scroll('_x', -this.x);
      Crafty.viewport._clamp();
    });
    this.onHit('PlayerControlledShip', function (e) {
      // Push the player forward
      for (var i = 0; i < e.length; i++) {
        var p = e[i].obj;
        p.attr({ x: p.x + this._speed.x });
      }
    });
  },
  scrollWall: function (speed) {
    if (speed.x !== undefined && speed.y !== undefined) {
      this._speed.x = speed.x;
      this._speed.y = speed.y;
    } else {
      this._speed.x = speed;
      this._speed.y = speed;
    }
    return this;
  },
  off: function () {
    this.unbind('EnterFrame');
  }
});

