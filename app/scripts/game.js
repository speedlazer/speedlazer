'use strict';

var Game = {
  // Initialize and start our game
  start: function (demo) {
    this.firstLevel = 'Game'
    Crafty.load([ ], function () {

      // Start crafty and set a background color so that we can see it's working
      Crafty.init(640, 480);
      Crafty.pixelart(true);
      Crafty.background('#000000');

      Crafty.e('Player, Color')
        .attr({ name: 'Player 1', z: 0 })
        .setName('Player 1')
        .color('#FF0000');

      Crafty.e('Player, Color')
        .attr({ name: 'Player 2', z: 10 })
        .setName('Player 2')
        .color('#00FF00');

      //Crafty.e('Player, Color')
        //.attr({ name: 'Player 3' })
        //.setName('Player 3')
        //.color('#0000FF');

      Crafty.e('KeyboardControls, PlayerAssignable')
        .controls({
          fire: Crafty.keys.SPACE,
          up: Crafty.keys.UP_ARROW,
          down: Crafty.keys.DOWN_ARROW,
          left: Crafty.keys.LEFT_ARROW,
          right: Crafty.keys.RIGHT_ARROW
        });

      Crafty.e('KeyboardControls, PlayerAssignable')
        .controls({
          fire: Crafty.keys.G,
          up: Crafty.keys.W,
          down: Crafty.keys.S,
          left: Crafty.keys.A,
          right: Crafty.keys.D
        });

      Crafty.e('GamepadControls, PlayerAssignable')
        .controls({
          gamepadIndex: 0,
          fire: 0
        });

      Crafty.e('GamepadControls, PlayerAssignable')
        .controls({
          gamepadIndex: 1,
          fire: 0
        });

      // Simply start splashscreen
      Crafty.enterScene('Intro');
    });
  }
};

// Export
window.Game = Game;

require('scripts/compiled/lib');
require('scripts/compiled/lazerscripts');
require('scripts/compiled/scenery');
