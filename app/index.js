import "./styles/normalize.css";
import "./styles/style.css";
import "./scripts/components";
import "./scripts/lib";
import "./scripts/scenery";
import "./scripts/lazerscripts";
import "./scripts/scenes";

import $ from "jquery";
import screenfull from "screenfull";
window.ga('create', process.env.GA_TRACKER, 'auto');
window.ga('send', 'pageview');

Game.start(false);

function scaleGame() {
  var stageHeight = $('#cr-stage').height(),
    stageWidth = $('#cr-stage').width(),
    viewportHeight = $(window).height() - 50,
    viewportWidth = $(window).width();

  var ratioY = viewportHeight / stageHeight;
  var ratioX = viewportWidth / stageWidth;
  var ratio = Math.min(ratioY, ratioX);

  $('#cr-stage').css('transform', 'scale('+ratio+')');

  $('footer').css({ top: (576 * ratio) });
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

setTimeout(function() { scaleGame(); }, 0);

