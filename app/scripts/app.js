require('scripts/components/*');
require('scripts/scenes/*');

require('scripts/game');

Game.start();

// Handle the fullscreen button
$(document).on('click', 'button', function () {
  if (screenfull.enabled) {
    screenfull.request($('#cr-stage')[0]);
    $(this).blur();
  }
});

Crafty.debugBar.show();
