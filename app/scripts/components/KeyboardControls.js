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
    movementMap[controlMap.up] = -90;
    movementMap[controlMap.down] = 90;
    movementMap[controlMap.left] = 180;
    movementMap[controlMap.right] = 0;

    ship.addComponent('Multiway, Keyboard')
      .multiway({ y: 3, x: 1 }, movementMap);
    this.listenTo(ship, 'KeyDown', function (e) {
      if (e.key === controlMap.fire) { ship.shoot(); }
    });
  }
});
