'use strict';

var Game = {
  // Initialize and start our game
  start: function () {
    Crafty.load([ ], function () {

      // Start crafty and set a background color so that we can see it's working
      Crafty.init(1024, 768);
      Crafty.background('#111');

      // Simply start splashscreen
      //Crafty.scene('Splashscreen');
      Crafty.enterScene('Space');
    });
  }
};

$(document).on('click', 'button', function() {
  Game.start();
  if (screenfull.enabled) {
    screenfull.request($('#cr-stage')[0]);
  }
});


