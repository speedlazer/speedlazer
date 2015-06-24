'use strict';

Crafty.c('ShipSpawnable', {
  init: function () {
    this.requires('Listener');
    this.bind('Activated', this.spawnShip);
  },
  remove: function () {
    this.unbind('Activated', this.spawnShip);
  },
  spawnPosition: function (x, y) {
    this.spawnPosition = { x: x, y: y };
    return this;
  },
  spawnShip: function () {
    if (!this.has('ControlScheme')) { return; }
    if (this.lives <= 0) { return; }

    var ship = Crafty.e('PlayerControlledShip')
      .attr({
        x: this.spawnPosition.x - Crafty.viewport.x,
        y: this.spawnPosition.y - Crafty.viewport.y
      });
    if (this.has('Color')) { ship.color(this.color()); }
    if (this.has('ControlScheme')) { this.assignControls(ship); }

    this.listenTo(ship, 'BulletHit', function () {
      this.addPoints(10);
    });
    this.listenTo(ship, 'BulletDestroyedTarget', function () {
      this.addPoints(50);
    });
    this.listenTo(ship, 'Hit', function () {
      ship.destroy();
      this.loseLife();
      this.spawnShip();
    });
    Crafty.trigger('ShipSpawned', ship);
    return this;
  },
});

