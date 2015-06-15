'use strict';

Crafty.c('HUD', {
  init: function () {
    this.requires('2D, Listener');
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

    this.updateHud();

    this.listenTo(player, 'UpdateLives', this.updateHud);
    this.listenTo(player, 'UpdatePoints', this.updateHud);
    this.listenTo(player, 'NewComponent', function (cl) {
      for (var i = 0; i < cl.length; i++) {
        var n = cl[i];
        if (n === 'ControlScheme') {
          this.updateHud();
        }
      }
    });
    this.listenTo(player, 'RemoveComponent', function (n) {
      if (n === 'ControlScheme') {
        this.updateHud();
      }
    });
    return this;
  },
  updateHud: function () {
    if (this.player.has('ControlScheme')) {
      this.score.text('Score: ' + this.player.points);
    } else {
      this.score.text(this.player.name);
    }
    if (this.player.has('ControlScheme')) {
      if (this.player.lives === 0) {
        this.lives.text('Game Over');
      } else {
        this.lives.text('Lives: ' + this.player.lives);
      }
    } else {
      this.lives.text('Press fire to start!');
    }
  }

});
