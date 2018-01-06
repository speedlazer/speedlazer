import "babel-polyfill";
import "./styles/normalize.css";
import "./styles/style.css";
import "./components";
import "./lib";
import "./scenery";
import "./scenes";
import "./systems/SeaLevel";

import screenfull from "screenfull";
/* eslint-env node */
window.ga("create", process.env.GA_TRACKER, "auto");
window.ga("send", "pageview");

Game.start(false);

const scaleGame = () => {
  const stage = document.getElementById("cr-stage");
  const stageHeight = stage.clientHeight;
  const stageWidth = stage.clientWidth;
  const viewportHeight = window.innerHeight - 50;
  const viewportWidth = window.innerWidth;

  const ratioY = viewportHeight / stageHeight;
  const ratioX = viewportWidth / stageWidth;
  const ratio = Math.min(ratioY, ratioX);

  stage.style.transform = `scale(${ratio})`;
  const left = Math.max(0, (viewportWidth - stageWidth * ratio) * 0.5);
  stage.style.left = `${left}px`;
  document.getElementsByTagName("footer")[0].style.top = `${576 * ratio}px`;
};

window.addEventListener("resize", scaleGame);

// Handle the fullscreen button
document.addEventListener("click", e => {
  if (e.target.matches("#cr-stage,#cr-stage *")) {
    const theater = document.getElementById("theater");
    screenfull.request(theater);
    document.body.classList.add("fullscreen");
    scaleGame();
    document.addEventListener(screenfull.raw.fullscreenchange, () => {
      if (!screenfull.isFullscreen) {
        // exit fullscreen code here
        document.body.classList.remove("fullscreen");
        scaleGame();
      }
    });
  }
});

setTimeout(scaleGame, 0);
