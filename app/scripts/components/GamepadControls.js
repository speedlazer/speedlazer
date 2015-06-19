'use strict';

Crafty.c('GamepadControls', {
  init: function () {
    this.requires('Listener');
    this.bind('RemoveComponent', function (componentName) {
      if (componentName === 'ControlScheme') {
        this.removeComponent('GamepadControls');
      }
    });
  },
  remove: function () {
    this.unbind('GamepadKeyChange', this._keyHandling);
  },
  setupControls: function (player) {
    player.addComponent('GamepadControls')
      .controls(this.controlMap)
      .addComponent('ControlScheme');
  },
  controls: function (controlMap) {
    this.controlMap = controlMap;
    if (controlMap.gamepadIndex === undefined) {
      return;
    }
    this.requires('Gamepad');
    this.gamepad(controlMap.gamepadIndex);

    this.bind('GamepadKeyChange', this._keyHandling);
    return this;
  },
  _keyHandling: function (e) {
    if (e.button === this.controlMap.fire && e.pressed) {
      this.trigger('Fire', e);
    }
  },
  assignControls: function (ship) {
    var controlMap = this.controlMap;

    ship.addComponent('GamepadMultiway, Gamepad')
      .gamepad(controlMap.gamepadIndex)
      .gamepadMultiway({
        speed: { y: 3, x: 1 },
        gamepadIndex: controlMap.gamepadIndex
      });
    this.listenTo(ship, 'GamepadKeyChange', function (e) {
        if (e.button === controlMap.fire && e.pressed) {
          ship.shootBullet();
        }
        if (e.button === controlMap.special && e.pressed) {
          ship.shootRocket();
        }
      });
  }
});
