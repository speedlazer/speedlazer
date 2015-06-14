'use strict';

Crafty.c('ShipSpawnable', {
  init: function () {
    this.bind('Activated', this.spawnShip);
  },
  remove: function () {
    this.unbind('Activated', this.spawnShip);
  },
  spawnShip: function () {
    if (!this.has('ControlScheme')) { return; }
    if (this.lives <= 0) { return; }

    var _this = this;
    var ship = Crafty.e('PlayerControlledShip')
      .attr({ x: 140, y: 320 });
    if (this.has('Color')) { ship.color(this.color()); }
    if (this.has('ControlScheme')) { this.assignControls(ship); }

    ship
      .bind('BulletHit', function () {
        _this.addPoints(10);
      })
      .bind('BulletDestroyedTarget', function () {
        _this.addPoints(50);
      })
      .bind('Hit', function () {
        this.destroy();
        _this.loseLife();
        _this.spawnShip();
      });
    return this;
  },
});

