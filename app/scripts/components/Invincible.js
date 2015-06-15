'use strict';

Crafty.c('Invincible', {
  init: function () {
    this.requires('Delay, Color');

    this.rawColor = this.color();
    //console.log(this.rawColor);
    this.delay(this._blink, 250, -1);
  },
  _blink: function () {
    if (this.blinkOn === undefined) {
      this.blinkOn = true;
    };
    this.blinkOn = !this.blinkOn;
    if (this.blinkOn) {
      this.color(this.rawColor, 0.5);
    } else {
      this.color(this.rawColor, 100.0);
    };
  },
  remove: function () {
    this.color(this.rawColor);
    this.cancelDelay(this._blink);
  },
  invincibleDuration: function (duration) {
    this.delay(function () {
      this.removeComponent('Invincible');
    }, duration, 0);
  }
});

