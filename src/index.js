import "babel-polyfill";
import "./styles/normalize.css";
import "./styles/style.css";
import "./components";
import "./scenery";
import "./scenes";
import "./systems/SeaLevel";

/* eslint-env node */
Game.start(false);

/**
 * Screen size management
 */
const scaleGame = () => {
  const stage = document.getElementById("cr-stage");
  const stageHeight = stage.clientHeight;
  const stageWidth = stage.clientWidth;
  const viewportHeight = window.innerHeight - 60;
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
const button = document.querySelector("button");
button.addEventListener("click", () => {
  const theater = document.getElementById("theater");
  theater.requestFullscreen();
  document.body.classList.add("fullscreen");
  scaleGame();
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      // exit fullscreen code here
      document.body.classList.remove("fullscreen");
      scaleGame();
    }
  });
});

setTimeout(scaleGame, 0);

/* eslint-env node */
document.getElementById("version").textContent = process.env.VERSION;
