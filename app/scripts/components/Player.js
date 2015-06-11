'use strict';

Crafty.c('Player', {
  lives: 2,
  points: 0,
  init: function () {
    this.requires('Model'); // Not in this version of Crafty yet...
    this.bind('Activated', function () {
      Crafty.trigger('PlayerActivated');
      this.spawnShip();
    });
  },
  spawnShip: function () {
    if (this.lives <= 0) { return; }

    var _this = this;
    this.ship = Crafty.e('PlayerControlledShip')
      .attr({ x: 140, y: 320 });
    if (this.has('Color')) { this.ship.color(this.color()); }
    if (this.has('ControlScheme')) { this.assignControls(this.ship); }

    this.ship
      .bind('BulletHit', function () {
        _this.addPoints(10);
      })
      .bind('BulletDestroyedTarget', function () {
        _this.addPoints(50);
      })
      .bind('Hit', function () {
        _this.loseLife();
      });
    return this;
  },
  loseLife: function () {
    this.ship.destroy();

    if (this.lives <= 0) { return; }
    this.lives -= 1;
    this.trigger('UpdateLives', { lives: this.lives });

    if (this.lives <= 0) {
      Crafty.trigger('PlayerDied', this);
    } else {
      this.spawnShip();
    }
  },
  addPoints: function (amount) {
    // Debatable should you get points for a target
    // that gets destroyed after you self died?
    if (this.lives <= 0) { return; }

    this.points += amount;
    this.trigger('UpdatePoints', { points: this.points });
  }
});
