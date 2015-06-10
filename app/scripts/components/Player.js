'use strict';

Crafty.c('Player', {
  init: function () {
    this.addComponent('Dormant');
    this.attr({ lives: 1, points: 0 });
    this.bind('Fire', function () {
      if (this.has('Dormant')) this.activate();
    });
  },
  activate: function () {
    var index = Crafty('Player Active').length;
    // maybe guard statement to only have
    // a max amount of players active (e.g. 2)

    this.removeComponent('Dormant');
    this.addComponent('Active');
    this.attr({ playerIndex: index });

    var colors = ['#F00', '#0F0', '#F0F'];
    this.addComponent('Color').color(colors[index]);
    this.trigger('Activated', this);

    this.spawnShip();
  },
  spawnShip: function () {
    this.ship = Crafty.e('PlayerControlledShip')
      .attr({ x: 140, y: 320 })
      .color(this.color());
    this.assignControls(this.ship);
  }
});

Crafty.c('KeyboardControls', {
  init: function() {
  },
  controls: function (controlMap) {
    this.controlMap = controlMap;
    this.bind('KeyDown', function (e) {
      if (e.key === this.controlMap.fire) {
        this.trigger('Fire', e);
      }
    });
  },
  assignControls: function (ship) {
    var controlMap = this.controlMap;

    var movementMap = {}
    movementMap[controlMap.up] = -90;
    movementMap[controlMap.down] = 90;
    movementMap[controlMap.left] = 180;
    movementMap[controlMap.right] = 0;

    ship.addComponent('Multiway, Keyboard')
      .multiway({ y: 3, x: 1 }, movementMap)
      .bind('KeyDown', function (e) {
        if (e.key === controlMap.fire) { this.shoot(); }
      });
  }
});

Crafty.c('PlayerHud', {
  hud: function (player) {


  }
});
