'use strict';

Crafty.defineScene('Space', function (data) {
  // import from globals
  var Game = window.Game;

  // constructor
  Crafty.background('#000');
  Crafty.viewport.x = 0;
  Crafty.viewport.y = 0;

  var activePlayerSpeed = 1;

  Crafty.one('ShipSpawned', function () {
    Crafty.e('ScrollWall').scrollWall(1);
  });
  Crafty.bind('ShipSpawned', function (ship) {
    ship.forcedSpeed(activePlayerSpeed);
  });

  Crafty('Player').each(function (index) {
    this.addComponent('ShipSpawnable')
      .spawnPosition(140, 300 + (index * 50));
    Crafty.e('HUD').hud(30 + (index * 300), this);
  });
  Crafty('Player ControlScheme').each(function () {
    this.spawnShip();
  });

  var level = Game.levelGenerator.createLevel();

  level.addBlock('cityStart', { stage: data.stage });
  level.generateBlocks('openSpace', 20);
  level.addBlock('levelEnd');
  level.start();

  Crafty.bind('EndOfLevel', function () {
    level.stop();
    Crafty.enterScene('Space', { stage: data.stage + 1 });
  });

  Crafty.bind('PlayerDied', function () {
    var playersActive = false;
    Crafty('Player ControlScheme').each(function () {
      if (this.lives > 0) { playersActive = true; }
    });
    if (playersActive === false) {
      level.stop();
      Crafty.enterScene('GameOver');
    }
  });

}, function () {
  // destructor
  Crafty.unbind('EnterFrame');
  Crafty.unbind('PlayerDied');
  Crafty.unbind('ShipSpawned');
  Crafty.unbind('EndOfLevel');
  Crafty('Player').each(function () {
    this.removeComponent('ShipSpawnable');
  });
});
