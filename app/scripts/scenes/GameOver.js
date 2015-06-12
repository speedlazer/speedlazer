'use strict';

Crafty.defineScene('GameOver', function (data) {
  // constructor
  Crafty.background('#111');

  Crafty.e('2D, DOM, Text').attr({ x: 200, y: 210, w: 450 }).text('Game Over')
    .textColor('#FF0000')
    .textFont({
      size: '80px',
      weight: 'bold',
      family: 'Courier new'
    });
  for (var i = 0; i < data.results.length; i++) {
    var playerData = data.results[i];

    Crafty.e('2D, DOM, Text').attr({ x: 240, y: 410 + (i * 50), w: 400 })
      .text(playerData.name + ': ' + playerData.score)
      .textColor(playerData.color)
      .textFont({
        size: '50px',
        weight: 'bold',
        family: 'Courier new'
      });
  }

  // After a timeout, be able to replay

}, function () {
  // destructor
});
