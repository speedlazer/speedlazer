'use strict';
require('scripts/components/*');
require('scripts/compiled/components');
require('scripts/compiled/game');
require('scripts/compiled/lib');
require('scripts/compiled/lazerscripts');
require('scripts/compiled/scenery');
require('scripts/scenes/*');
require('scripts/compiled/scenes');

window.Game.start(false);

// Handle the fullscreen button
$(document).on('click', '#cr-stage', function () {
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
