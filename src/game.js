import CryptoJS from "crypto-js";
import defaults from "lodash/defaults";
import sortBy from "lodash/sortBy";

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
  paused: false,
  togglePause() {
    this.paused = !this.paused;

    if (this.paused) {
      this.setGameSpeed(0.0);

      Crafty('Delay').each(function() { return this.pauseDelays(); });
      Crafty('Tween').each(function() { return this.pauseTweens(); });
      Crafty('Particles').each(function() { return this.pauseParticles(); });
      Crafty('SpriteAnimation').each(function() { return this.pauseAnimation(); });
      Crafty('PlayerControlledShip').each(function() {
        if (this.disableControls) return;
        this.disabledThroughPause = true;
        this.disableControl();
      });

    } else {

      this.setGameSpeed(1.0);
      Crafty('Delay').each(function() { return this.resumeDelays(); });
      Crafty('Tween').each(function() { return this.resumeTweens(); });
      Crafty('Particles').each(function() { return this.resumeParticles(); });
      Crafty('SpriteAnimation').each(function() { return this.resumeAnimation(); });
      Crafty('PlayerControlledShip').each(function() {
        if (!this.disabledThroughPause) return;
        this.disabledThroughPause = null;
        this.enableControl();
      });
    }

    Crafty.trigger('GamePause', this.paused);
  },

  setGameSpeed(speed) {
    this.gameSpeed = speed;
    Crafty('SpriteAnimation').each(function() {
      if (this.has('TimeManager')) { return; }
      return this.animationSpeed = speed;
    });
    Crafty('Delay').each(function() {
      if (this.has('TimeManager')) { return; }
      return this.delaySpeed = speed;
    });
    return Crafty('Tween').each(function() {
      if (this.has('TimeManager')) { return; }
      return this.tweenSpeed = speed;
    });
  },

  // Initialize and start our game
  start() {
    this.resetCredits();

    const settings = this.settings();
    if (settings.sound === false) {
      Crafty.audio.mute();
    }

    this.gameTime = 0;
    this.setGameSpeed(1.0);

    Crafty.bind('NewEntity', data => {
      const entity = Crafty(data.id);
      if (entity.has('TimeManager')) { return; }
      if (entity.has('SpriteAnimation')) {
        entity.animationSpeed = this.gameSpeed;
      }
      if (entity.has('Delay')) {
        entity.delaySpeed = this.gameSpeed;
      }
      if (entity.has('Tween')) {
        entity.tweenSpeed = this.gameSpeed;
      }
    });

    Crafty.bind('UpdateFrame', fd => {
      if (!Game.paused) { this.gameTime += fd.dt; }
      fd.dt = fd.dt * this.gameSpeed;
      fd.inGameTime = this.gameTime;

      return Crafty.trigger('GameLoop', fd);
    });


    Crafty.paths({
      audio: './',
      images: './'
    });
    // Start crafty and set a background color so that we can see it's working
    const stage = document.getElementById('cr-stage');
    Crafty.init(1024, 576, stage); // PAL+
    //Crafty.pixelart(true)
    Crafty.background('#000000');
    Crafty.timer.FPS(1000 / 17); // 17ms per frame

    Crafty.e('Player, Color')
      .attr({name: 'Player 1', z: 0, playerNumber: 1})
      .setName('Player 1')
      .color('#FF0000');

    //Crafty.e('Player, Color')
      //.attr(name: 'Player 2', z: 10, playerNumber: 2)
      //.setName('Player 2')
      //.color('#00FF00')

    Crafty.e('AnalogKeyboardControls, PlayerAssignable')
      .controls({
        fire: Crafty.keys.SPACE,
        switchWeapon: Crafty.keys.PERIOD,
        super: Crafty.keys.ENTER,
        up: Crafty.keys.UP_ARROW,
        down: Crafty.keys.DOWN_ARROW,
        left: Crafty.keys.LEFT_ARROW,
        right: Crafty.keys.RIGHT_ARROW,
        pause: Crafty.keys.P
    });

    Crafty.e('AnalogKeyboardControls, PlayerAssignable')
      .controls({
        fire: Crafty.keys.G,
        switchWeapon: Crafty.keys.H,
        up: Crafty.keys.W,
        down: Crafty.keys.S,
        left: Crafty.keys.A,
        right: Crafty.keys.D,
        pause: Crafty.keys.Q
    });

    Crafty.e('GamepadControls, PlayerAssignable')
      .controls({
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

    Crafty.e('GamepadControls, PlayerAssignable')
      .controls({
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

    // Simply start splashscreen
    //handler = (e) =>
      //if e.key == Crafty.keys.N
        //Crafty.unbind('KeyDown', handler)
        //Crafty.enterScene('Game', script: 'Lunch', checkpoint: 0)

    //Crafty.bind('KeyDown', handler)
    //Crafty.enterScene('New')
    Crafty.enterScene('Intro');
  },

  resetCredits() {
    this.credits = 2;
  }, // This is actually 'Extra' credits, so in total 3

  highscores() {
    const loadList = function() {
      const data = localStorage.getItem('SPDLZR');
      if (!data) { return []; }
      const k = data.slice(0,20);
      const d = data.slice(20);
      const s = CryptoJS.AES.decrypt(d,k);
      const v = s.toString(CryptoJS.enc.Utf8);
      if (!(v.length > 1)) { return []; }
      return JSON.parse(v);
    };

    const loadedList = loadList();

    const defInit = 'SPL';
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
    return sortBy(list, 'score').reverse();
  },

  settings() {
    const data = localStorage.getItem('SPDLZRS');
    let settings = {};
    if (data) {
      settings = JSON.parse(data);
    }
    return defaults(settings,
      {sound: true}
    );
  },

  changeSettings(changes = {}) {
    const newSettings = defaults(changes,
      this.settings()
    );
    const str = JSON.stringify(newSettings);
    return localStorage.setItem('SPDLZRS', str);
  }
};

// Export
export default Game;
