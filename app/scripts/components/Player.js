'use strict';

Crafty.c('Player', {
  init: function () {
    this.addComponent('2D, Canvas, Color, Collision');
    this.attr({ w: 30, h: 30, lives: 1, points: 0 })
      .bind('Moved', function (from) {
        if (this.hit('Edge')) { // Contain player within playfield
          this.attr({x: from.x, y: from.y});
        }
      })
      .onHit('Enemy', function () {
        this.loseLife();
      })
      .bind('BulletHit', function () {
        this.addPoints(10);
      })
      .bind('BulletDestroy', function () {
        this.addPoints(50);
      });
  },
  shoot: function () {
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
      });
  },
  loseLife: function () {
    this.lives -= 1;
    this.attr({ x: 140, y: 350 });

    this.trigger('UpdateLives', { lives: this.lives });
    if (this.lives <= 0) {
      Crafty.trigger('PlayerDied', this);
    }
  },
  addPoints: function (amount) {
    this.points += amount;
    this.trigger('UpdatePoints', { points: this.points });
  }
});
