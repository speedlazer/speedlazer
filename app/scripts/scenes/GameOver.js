'use strict';

Crafty.defineScene('GameOver', function (data) {
  // constructor
  Crafty.background('#111');

  Crafty.e('2D, Canvas, Text').attr({ x: 200, y: 210, w: 150 }).text('Game Over')
    .textColor('#F00')
    .textFont({
      size: '80px',
      weight: 'bold',
      family: 'Courier new'
    });
  Crafty.e('2D, Canvas, Text').attr({ x: 240, y: 410, w: 200 }).text('Score: ' + data.score)
    .textColor('#F00')
    .textFont({
      size: '50px',
      weight: 'bold',
      family: 'Courier new'
    });

}, function () {
  // destructor
});
