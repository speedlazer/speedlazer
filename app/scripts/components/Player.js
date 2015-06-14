'use strict';

Crafty.c('Player', {
  lives: 2,
  points: 0,
  init: function () {
  },
  loseLife: function () {
    if (this.lives <= 0) { return; }
    this.lives -= 1;
    this.trigger('UpdateLives', { lives: this.lives });

    if (this.lives <= 0) {
      Crafty.trigger('PlayerDied', this);
    }
  },
  addPoints: function (amount) {
    // Debatable should you get points for a target
    // that gets destroyed after you self died?
    if (this.lives <= 0) { return; }

    this.points += amount;
    this.trigger('UpdatePoints', { points: this.points });
  }
});
