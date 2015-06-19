'use strict';

var Game = {
  // Initialize and start our game
  start: function () {
    Crafty.load([ ], function () {

      // Start crafty and set a background color so that we can see it's working
      Crafty.init(1024, 768);
      Crafty.background('#111');

      Crafty.e('Player, Color')
        .attr({ name: 'Player 1' })
        .setName('Player 1')
        .color('#FF0000');

      Crafty.e('Player, Color')
        .attr({ name: 'Player 2' })
        .setName('Player 2')
        .color('#00FF00');

      Crafty.e('KeyboardControls, PlayerAssignable')
        .controls({
          fire: Crafty.keys.SPACE,
          special: Crafty.keys.B,
          up: Crafty.keys.UP_ARROW,
          down: Crafty.keys.DOWN_ARROW,
          left: Crafty.keys.LEFT_ARROW,
          right: Crafty.keys.RIGHT_ARROW
        });

      Crafty.e('KeyboardControls, PlayerAssignable')
        .controls({
          fire: Crafty.keys.G,
          special: Crafty.keys.H,
          up: Crafty.keys.W,
          down: Crafty.keys.S,
          left: Crafty.keys.A,
          right: Crafty.keys.D
        });

      Crafty.e('GamepadControls, PlayerAssignable')
        .controls({
          gamepadIndex: 0,
          fire: 0,
          special: 1
        });

      Crafty.e('GamepadControls, PlayerAssignable')
        .controls({
          gamepadIndex: 1,
          fire: 0,
          special: 1
        });

      // Simply start splashscreen
      //Crafty.scene('Splashscreen');
      Crafty.enterScene('Space');
    });
  }
};

Game.start();

$(document).on('click', 'button', function () {
  if (screenfull.enabled) {
    screenfull.request($('#cr-stage')[0]);
    $(this).blur();
  }
});


