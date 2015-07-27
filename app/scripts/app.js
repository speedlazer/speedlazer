'use strict';
require('scripts/components/*');
require('scripts/compiled/components');
require('scripts/scenes/*');
require('scripts/compiled/scenes');

require('scripts/game');

window.Game.start(true);

// Handle the fullscreen button
$(document).on('click', function () {
  if (screenfull.enabled) {
    screenfull.request($('#cr-stage')[0]);
    $('body').addClass('fullscreen');
    document.addEventListener(screenfull.raw.fullscreenchange, function () {
      if (!screenfull.isFullscreen) {
        // exit fullscreen code here
        $('body').removeClass('fullscreen');
      }
    });
  }
});


function scaleGame() {
  var stageHeight = $('#cr-stage').height(),
    viewportHeight = $(window).height(),
    ratio = viewportHeight / stageHeight;

  $('#cr-stage').css('transform', 'scale('+ratio+')');
}
$(window).on('resize', function() {
  scaleGame();
});

scaleGame();


//Crafty.debugBar.show();
