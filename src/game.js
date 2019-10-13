import CryptoJS from "crypto-js";
import sortBy from "lodash/sortBy";
import { setGameSpeed, getGameSpeed } from "./lib/core/gameSpeed";
import { isPaused } from "./lib/core/pauseToggle";
import AnalogKeyboardControls from "src/components/controls/AnalogKeyboardControls";
import GamepadControls from "src/components/controls/GamepadControls";
import Player from "src/components/player/Player";
import PlayerAssignable from "src/components/player/PlayerAssignable";

/*
 * Destructure this file into multiple components
 *
 * - extract Pause functionality
 * - extract GameSpeed functionality
 * - extract Background color functionality
 *
 * Further: Check why so many parts need access to 'Game.paused'
 *
 */

const Game = {
  // Initialize and start our game
  start() {
    this.resetCredits();

    const settings = this.settings();
    if (settings.sound === false) {
      Crafty.audio.mute();
    }

    this.gameTime = 0;
    setGameSpeed(1.0);

    Crafty.bind("UpdateFrame", fd => {
      if (!isPaused()) {
        this.gameTime += fd.dt;
      }
      fd.dt = fd.dt * getGameSpeed();
      fd.inGameTime = this.gameTime;

      Crafty.trigger("GameLoop", fd);
    });

    Crafty.paths({
      audio: "./",
      images: "./"
    });
    // Start crafty and set a background color so that we can see it's working
    const stage = document.getElementById("cr-stage");
    Crafty.init(1024, 576, stage); // PAL+
    //Crafty.pixelart(true)
    Crafty.background("#000000");
    Crafty.timer.FPS(1000 / 17); // 17ms per frame

    Crafty.e([Player, "Color"].join(", "))
      .attr({ name: "Player 1", z: 0, playerNumber: 1 })
      .setName("Player 1")
      .color("#FF0000");

    //Crafty.e('Player, Color')
    //.attr({name: 'Player 2', z: 10, playerNumber: 2})
    //.setName('Player 2')
    //.color('#00FF00')

    Crafty.e([AnalogKeyboardControls, PlayerAssignable].join(", ")).controls({
      fire: Crafty.keys.SPACE,
      switchWeapon: Crafty.keys.PERIOD,
      super: Crafty.keys.ENTER,
      up: Crafty.keys.UP_ARROW,
      down: Crafty.keys.DOWN_ARROW,
      left: Crafty.keys.LEFT_ARROW,
      right: Crafty.keys.RIGHT_ARROW,
      pause: Crafty.keys.P
    });

    Crafty.e([AnalogKeyboardControls, PlayerAssignable].join(", ")).controls({
      fire: Crafty.keys.G,
      switchWeapon: Crafty.keys.H,
      up: Crafty.keys.W,
      down: Crafty.keys.S,
      left: Crafty.keys.A,
      right: Crafty.keys.D,
      pause: Crafty.keys.Q
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

    Crafty.e([GamepadControls, PlayerAssignable].join(", ")).controls({
      gamepadIndex: 1,
      fire: 0,
      switchWeapon: 2,
      super: 4,
      pause: 9,
      up: 12,
      down: 13,
      left: 14,
      right: 15
    });

    Crafty.enterScene("Intro");
  },

  resetCredits() {
    this.credits = 2;
  }, // This is actually 'Extra' credits, so in total 3

  highscores() {
    const loadList = function() {
      const data = localStorage.getItem("SPDLZR");
      if (!data) {
        return [];
      }
      const k = data.slice(0, 20);
      const d = data.slice(20);
      const s = CryptoJS.AES.decrypt(d, k);
      const v = s.toString(CryptoJS.enc.Utf8);
      if (!(v.length > 1)) {
        return [];
      }
      return JSON.parse(v);
    };

    const loadedList = loadList();

    const defInit = "SPL";
    const list = [
      { initials: defInit, score: 30000 },
      { initials: defInit, score: 20000 },
      { initials: defInit, score: 10000 },
      { initials: defInit, score: 5000 },
      { initials: defInit, score: 2500 },
      { initials: defInit, score: 1500 },
      { initials: defInit, score: 1000 },
      { initials: defInit, score: 5000 },
      { initials: defInit, score: 2000 },
      { initials: defInit, score: 1500 }
    ].concat(loadedList);
    return sortBy(list, "score").reverse();
  },

  settings() {
    const data = localStorage.getItem("SPDLZRS");
    let settings = {};
    if (data) {
      settings = JSON.parse(data);
    }
    return { sound: true, ...settings };
  },

  changeSettings(changes = {}) {
    const newSettings = {
      ...this.settings(),
      ...changes
    };
    const str = JSON.stringify(newSettings);
    return localStorage.setItem("SPDLZRS", str);
  }
};

// Export
export default Game;