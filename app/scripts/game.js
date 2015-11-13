'use strict';

var Game = {
  // Initialize and start our game
  start: function () {
    this.firstLevel = 'Game';
    this.resetCredits();

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
          secondary: Crafty.keys.CTRL,
          up: Crafty.keys.UP_ARROW,
          down: Crafty.keys.DOWN_ARROW,
          left: Crafty.keys.LEFT_ARROW,
          right: Crafty.keys.RIGHT_ARROW
        });

      Crafty.e('KeyboardControls, PlayerAssignable')
        .controls({
          fire: Crafty.keys.G,
          secondary: Crafty.keys.H,
          up: Crafty.keys.W,
          down: Crafty.keys.S,
          left: Crafty.keys.A,
          right: Crafty.keys.D
        });

      Crafty.e('GamepadControls, PlayerAssignable')
        .controls({
          gamepadIndex: 0,
          fire: 0,
          secondary: 1
        });

      Crafty.e('GamepadControls, PlayerAssignable')
        .controls({
          gamepadIndex: 1,
          fire: 0,
          secondary: 1
        });

      // Simply start splashscreen
      Crafty.enterScene('Intro');
    });
  },
  resetCredits: function() {
    this.credits = 2; // This is actually 'Extra' credits, so in total 3
  }
};

// Export
window.Game = Game;

