import "!style-loader!css-loader!postcss-loader!sass-loader!./styles/normalize.css";
import "!style-loader!css-loader!postcss-loader!sass-loader!./styles/style.css";
import "./components";
import "./scenes";
import { setupControls } from "./setup-game";
import "src/lib/GameLoop";
import Player from "src/components/player/Player";
import { setGameSpeed } from "./lib/core/gameSpeed";
import audio from "src/lib/audio";

audio.setEffectVolume(0.4);
audio.setMusicVolume(0.4);
setGameSpeed(1.0);

Crafty.paths({
  images: "./"
});
// Start crafty and set a background color so that we can see it's working
const stage = document.getElementById("cr-stage");
Crafty.init(1024, 576, stage); // PAL+
Crafty.background("#000000");
Crafty.timer.FPS(60);
Crafty.createLayer("UILayerDOM", "DOM", {
  scaleResponse: 0,
  yResponse: 0,
  xResponse: 0,
  z: 40
});
Crafty.createLayer("UILayerWebGL", "WebGL", {
  scaleResponse: 0,
  yResponse: 0,
  xResponse: 0,
  z: 35
});

Crafty.e([Player, "Color"].join(", "))
  .attr({ name: "Player 1", z: 0, playerNumber: 1 })
  .setName("Player 1")
  .color("#FF0000");

setupControls();

Crafty.enterScene("Intro");

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
