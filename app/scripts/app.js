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

function scaleGame() {
  var stageHeight = $('#cr-stage').height(),
    stageWidth = $('#cr-stage').width(),
    viewportHeight = $(window).height(),
    viewportWidth = $(window).width();

  var ratioY = viewportHeight / stageHeight;
  var ratioX = viewportWidth / stageWidth;
  var ratio = Math.min(ratioY, ratioX);

  $('#cr-stage').css('transform', 'scale('+ratio+')');
}

$(window).on('resize', function() {
  scaleGame();
});

// Handle the fullscreen button
$(document).on('click', '#cr-stage', function () {
  if (screenfull.enabled) {
    screenfull.request($('#theater')[0]);
    $('body').addClass('fullscreen');
    scaleGame();
    document.addEventListener(screenfull.raw.fullscreenchange, function () {
      if (!screenfull.isFullscreen) {
        // exit fullscreen code here
        $('body').removeClass('fullscreen');
        scaleGame();
      }
    });
  }
});

scaleGame();
