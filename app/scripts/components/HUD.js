'use strict';

Crafty.c('HUD', {
  hud: function (x) {
    var score = Crafty.e('2D, DOM, Text')
      .attr({ x: x, y: 10, w: 150, h: 20})
      .textFont({
        size: '20px',
        weight: 'bold',
        family: 'Courier new'
      });
    if (this.has('Color')) { score.textColor(this.color()); }

    var lives = Crafty.e('2D, DOM, Text')
      .attr({ x: x, y: 30, w: 250, h: 20 })
      .textFont({
        size: '20px',
        weight: 'bold',
        family: 'Courier new'
      });
    if (this.has('Color')) { lives.textColor(this.color()); }

    var updateText = function () {
      if (this.has('ControlScheme')) {
        score.text('Score: ' + this.points);
      } else {
        score.text(this._entityName);
      }
      if (this.has('ControlScheme')) {
        if (this.lives === 0) {
          lives.text('Game Over');
        } else {
          lives.text('Lives: ' + this.lives);
        }
      } else {
        lives.text('Press fire to start!');
      }
    };

    updateText.call(this);

    this.bind('UpdateLives', updateText);
    this.bind('UpdatePoints', updateText);
    this.bind('Activated', updateText);

    return this;
  }
});
