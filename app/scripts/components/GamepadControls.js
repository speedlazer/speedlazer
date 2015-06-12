'use strict';

Crafty.c('GamepadControls', {
  init: function () {
  },
  setupControls: function (player) {
    player.addComponent('GamepadControls')
      .controls(this.controlMap);
  },
  controls: function (controlMap) {
    this.controlMap = controlMap;
    if (controlMap.gamepadIndex === undefined) {
      return;
    }
    this.requires('Gamepad');
    this.gamepad(controlMap.gamepadIndex);

    this.bind('GamepadKeyChange', function (e) {
      if (e.button === this.controlMap.fire && e.pressed) {
        this.trigger('Fire', e);
      }
    });
    return this;
  },
  assignControls: function (ship) {
    var controlMap = this.controlMap;

    ship.addComponent('GamepadMultiway, Gamepad')
      .gamepad(controlMap.gamepadIndex)
      .gamepadMultiway({
        speed: { y: 3, x: 1 },
        gamepadIndex: controlMap.gamepadIndex
      })
      .bind('GamepadKeyChange', function (e) {
        if (e.button === controlMap.fire && e.pressed) {
          this.shoot();
        }
      });
  }
});
