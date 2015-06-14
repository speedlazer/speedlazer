'use strict';

Crafty.defineScene('Space', function () {
  // constructor
  Crafty.background('#000');

  Crafty('Player').each(function (index) {
    this.addComponent('ShipSpawnable');
    Crafty.e('HUD').hud(30 + (index * 300), this);
  });
  Crafty('Player ControlScheme').each(function () {
    this.spawnShip();
  });

  // Create edges around playfield to 'capture' the player
  Crafty.e('2D, Canvas, Edge')
    .attr({x: 10, y: 50, w: 900, h: 2});

  Crafty.e('2D, Canvas, Edge')
    .attr({x: 10, y: 750, w: 900, h: 2});

  Crafty.e('2D, Canvas, Edge')
    .attr({x: 10, y: 50, w: 2, h: 730 });

  Crafty.e('2D, Canvas, Edge')
    .attr({x: 910, y: 50, w: 2, h: 730 });


  var gamespeed = 0.4; // pixels / milisecond
  var nextEnemySpawn = 50;
  //var nextEnemySpawn = 5000;
  var startTime = null;

  Crafty.one('PlayerActivated', function () {
    if (startTime !== null) {
      return;
    }
    startTime = (new Date()).getTime();

    Crafty.bind('EnterFrame', function () {
      // TODO: Refactor this to be able to act on game pauses

      var x = ((new Date()).getTime() - startTime) * gamespeed;
      if (nextEnemySpawn < x) {
        var y = Crafty.math.randomInt(40, 720);

        Crafty.e('Enemy').enemy({ x: 1200, y: y });
        nextEnemySpawn += Crafty.math.randomInt(100, 2000);
        console.log('Time to spawn!');
      }
    });
  });

  Crafty.bind('PlayerDied', function () {
    var playersActive = false;
    Crafty('Player ControlScheme').each(function () {
      if (this.lives > 0) { playersActive = true; }
    });
    if (playersActive === false) {
      Crafty.enterScene('GameOver');
    }
  });

}, function () {
  // destructor
  Crafty.unbind('EnterFrame');
  Crafty.unbind('PlayerDied');
  Crafty('Player').each(function () {
    this.removeComponent('ShipSpawnable');
  });
});
