'use strict';

Crafty.defineScene('GameOver', function () {
  // constructor
  Crafty.background('#111');

  Crafty.e('2D, DOM, Text').attr({ x: 200, y: 210, w: 450 }).text('Game Over')
    .textColor('#FF0000')
    .textFont({
      size: '80px',
      weight: 'bold',
      family: 'Courier new'
    });

  Crafty('Player ControlScheme').each(function (index) {
    Crafty.e('2D, DOM, Text').attr({ x: 240, y: 310 + (index * 50), w: 700 })
      .text(this.name + ': ' + this.points)
      .textColor(this.color())
      .textFont({
        size: '50px',
        weight: 'bold',
        family: 'Courier new'
      });
  });

  // After a timeout, be able to replay
  Crafty.e('Delay').delay(function () {
    Crafty.e('2D, DOM, Text').attr({ x: 200, y: 590, w: 750 }).text('Press fire to start again')
      .textColor('#FF0000')
      .textFont({
        size: '30px',
        weight: 'bold',
        family: 'Courier new'
      });
    Crafty('Player').each(function () {
      // Turn this into a more generic 'reset player'
      this.removeComponent('ControlScheme')
        .attr({
          lives: 2,
          points: 0
        });
      this.one('Activated', function () {
        Crafty.enterScene('Space');
      });
    });
  }, 2000, 0);

}, function () {
  // destructor
  Crafty('Player').each(function () {
    this.unbind('Activated');
  });
});
