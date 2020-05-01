import "!style-loader!css-loader!postcss-loader!sass-loader!./styles/normalize.css";
import "!style-loader!css-loader!postcss-loader!sass-loader!./styles/style.css";
import "./components";
import "./scenes";
import { isPaused } from "./lib/core/pauseToggle";
import Player from "src/components/player/Player";
import AnalogKeyboardControls from "src/components/controls/AnalogKeyboardControls";
import GamepadControls from "src/components/controls/GamepadControls";
import PlayerAssignable from "src/components/player/PlayerAssignable";
import { setGameSpeed, getGameSpeed } from "./lib/core/gameSpeed";
import { setEffectVolume, setMusicVolume } from "src/lib/audio";

setEffectVolume(0.4);
setMusicVolume(0.4);
setGameSpeed(1.0);

Crafty.paths({
  images: "./"
});
// Start crafty and set a background color so that we can see it's working
const stage = document.getElementById("cr-stage");
Crafty.init(1024, 576, stage); // PAL+
//Crafty.pixelart(true)
Crafty.background("#000000");
Crafty.timer.FPS(1000 / 10); // 17ms per frame
Crafty.e([Player, "Color"].join(", "))
  .attr({ name: "Player 1", z: 0, playerNumber: 1 })
  .setName("Player 1")
  .color("#FF0000");

Crafty.e([AnalogKeyboardControls, PlayerAssignable].join(", ")).controls({
  fire: Crafty.keys.SPACE,
  switchWeapon: Crafty.keys.Z,
  heavy: Crafty.keys.C,
  shield: Crafty.keys.X,
  up: Crafty.keys.UP_ARROW,
  down: Crafty.keys.DOWN_ARROW,
  left: Crafty.keys.LEFT_ARROW,
  right: Crafty.keys.RIGHT_ARROW,
  pause: Crafty.keys.P
});

Crafty.e([GamepadControls, PlayerAssignable].join(", ")).controls({
  gamepadIndex: 0,
  fire: 0,
  switchWeapon: 2,
  super: 4,
  pause: 9,
  up: 12,
  down: 13,
  left: 14,
  right: 15
});

let gameTime = 0;
Crafty.bind("UpdateFrame", fd => {
  if (!isPaused()) {
    gameTime += fd.dt;
  }
  fd.dt = fd.dt * getGameSpeed();
  fd.inGameTime = gameTime;

  Crafty.trigger("GameLoop", fd);
});

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
