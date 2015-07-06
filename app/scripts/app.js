'use strict';
require('scripts/components/*');
require('scripts/compiled/components');
require('scripts/scenes/*');
require('scripts/compiled/scenes');

require('scripts/game');

window.Game.start();

// Handle the fullscreen button
$(document).on('click', 'button', function () {
  if (screenfull.enabled) {
    screenfull.request($('#cr-stage')[0]);
    $(this).blur();
  }
});

Crafty.debugBar.show();
