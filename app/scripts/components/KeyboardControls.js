'use strict';

Crafty.c('KeyboardControls', {
  init: function () {
    this.requires('Listener');
    this.bind('RemoveComponent', function (componentName) {
      if (componentName === 'ControlScheme') {
        this.removeComponent('KeyboardControls');
      }
    });
  },
  remove: function () {
    this.unbind('KeyDown', this._keyHandling);
  },
  setupControls: function (player) {
    player.addComponent('KeyboardControls')
      .controls(this.controlMap)
      .addComponent('ControlScheme');
  },
  controls: function (controlMap) {
    this.controlMap = controlMap;
    this.bind('KeyDown', this._keyHandling);
    return this;
  },
  _keyHandling: function (e) {
    if (e.key === this.controlMap.fire) {
      this.trigger('Fire', e);
    }
  },
  assignControls: function (ship) {
    var controlMap = this.controlMap;

    var movementMap = {};
    var directions = {
      up: -90,
      down: 90,
      left: 180,
      right: 0
    };
    // Remap back to key names to prevent sliding effect
    for (var i in directions) {
      var value = directions[i];
      var keyValue = controlMap[i];
      for (var j in Crafty.keys) {
        if (Crafty.keys[j] === keyValue) {
          movementMap[j] = value;
        }
      }
    }

    ship.addComponent('Multiway, Keyboard')
      .multiway({ y: 3, x: 1 }, movementMap);
    this.listenTo(ship, 'KeyDown', function (e) {
      if (e.key === controlMap.fire) { ship.shoot(); }
    });
  }
});
