'use strict';

Crafty.c('HUD', {
  init: function () {
    var _this = this;
    this.requires('2D');
    this._addControlScheme = function (cl) {
      for (var i = 0; i < cl.length; i++) {
        var n = cl[i];
        if (n === 'ControlScheme') {
          _this._updateHud();
        }
      }
    };
    this._removeControlScheme = function (n) {
      if (n === 'ControlScheme') {
        _this._updateHud();
      }
    };
    this._updateHud = function () {
      if (_this.player.has('ControlScheme')) {
        _this.score.text('Score: ' + _this.player.points);
      } else {
        _this.score.text(_this.player.name);
      }
      if (_this.player.has('ControlScheme')) {
        if (_this.player.lives === 0) {
          _this.lives.text('Game Over');
        } else {
          _this.lives.text('Lives: ' + _this.player.lives);
        }
      } else {
        _this.lives.text('Press fire to start!');
      }
    };
  },
  remove: function () {
    if (this.player === undefined) {
      return;
    }
    this.player.unbind('UpdateLives', this._updateHud);
    this.player.unbind('UpdatePoints', this._updateHud);
    this.player.unbind('NewComponent', this._addControlScheme);
    this.player.unbind('RemoveComponent', this._removeControlScheme);
  },
  hud: function (x, player) {
    this.player = player;
    this.score = Crafty.e('2D, DOM, Text')
      .attr({ x: x, y: 10, w: 150, h: 20})
      .textFont({
        size: '20px',
        weight: 'bold',
        family: 'Courier new'
      });
    if (this.player.has('Color')) {
      this.score.textColor(this.player.color());
    }

    this.lives = Crafty.e('2D, DOM, Text')
      .attr({ x: x, y: 30, w: 250, h: 20 })
      .textFont({
        size: '20px',
        weight: 'bold',
        family: 'Courier new'
      });
    if (this.player.has('Color')) {
      this.lives.textColor(player.color());
    }

    this._updateHud();

    this.player.bind('UpdateLives', this._updateHud);
    this.player.bind('UpdatePoints', this._updateHud);
    this.player.bind('NewComponent', this._addControlScheme);
    this.player.bind('RemoveComponent', this._removeControlScheme);
    return this;
  }

});
