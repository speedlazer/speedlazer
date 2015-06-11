'use strict';

Crafty.c('KeyboardControls', {
  init: function () {
    this.one('Fire', function () {
      if (!this.has('Player')) {
        var players = Crafty('Player');
        for (var i = 0; i < players.length; i++) {
          var player = Crafty(players[i]);
          if (!player.has('ControlScheme')) {
            player
              .addComponent('ControlScheme')
              .addComponent('KeyboardControls')
              .controls(this.controlMap);
            player.trigger('Activated');
            this.destroy();
            break;
          }
        }
      }
    });
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

    var movementMap = {};
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
