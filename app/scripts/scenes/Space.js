'use strict';

Crafty.defineScene('Space', function () {
  // constructor
  Crafty.background('#000');

  Crafty('Player').each(function (index) {
    this.addComponent('ShipSpawnable')
      .spawnPosition(140, 300 + (index * 50));
    Crafty.e('HUD').hud(30 + (index * 300), this);
  });
  Crafty('Player ControlScheme').each(function () {
    this.spawnShip();
  });

  // Create edges around playfield to 'capture' the player

  var levelSize = {
    h: 710,
    w: 2500,
    x: 10,
    y: 50
  }

  // Top
  Crafty.e('2D, Canvas, Edge, Color')
    .color('#FFFF00')
    .attr({x: levelSize.x, y: levelSize.y, w: levelSize.w, h: 2});

  // Bottom
  Crafty.e('2D, Canvas, Edge, Color')
    .color('#FFFF00')
    .attr({x: levelSize.x, y: levelSize.y + levelSize.h, w: levelSize.w, h: 2});

  // Left
  Crafty.e('2D, Canvas, Edge, Color')
    .color('#FFFF00')
    .attr({x: levelSize.x, y: levelSize.y, w: 2, h: levelSize.h });

  // Right
  Crafty.e('2D, Canvas, Edge, Color')
    .color('#FFFF00')
    .attr({x: levelSize.x + levelSize.w, y: levelSize.y, w: 2, h: levelSize.h });

  Crafty.viewport.bounds = {
    min: { x: 0,    y: 0   },
    max: { x: levelSize.w + levelSize.x, y: levelSize.y + levelSize.h }
  };


  // some obstacles, to form a 'level'
  Crafty.e('2D, Canvas, Edge, Color')
    .color('#404040')
    .attr({x: 910, y: 150, w: 42, h: 70 });

  Crafty.e('2D, Canvas, Edge, Color')
    .color('#404040')
    .attr({x: 1310, y: 550, w: 82, h: 30 });

  Crafty('Edge').each(function () {
    this.addComponent('Collision').onHit('Bullet', function (e) {
      var bullet = e[0].obj;
      bullet.destroy();
    });
  });

  Crafty.one('ShipSpawned', function () {
    var ship = Crafty(Crafty('PlayerControlledShip')[0])

    Crafty.viewport.follow(ship, 0, 0);
  })
  //Crafty.viewport.pan(1000, 0, 10000);


  //var gamespeed = 0.4; // pixels / milisecond
  //var nextEnemySpawn = 50;
  ////var nextEnemySpawn = 5000;
  //var startTime = null;

  //Crafty.one('PlayerActivated', function () {
    //if (startTime !== null) {
      //return;
    //}
    //startTime = (new Date()).getTime();

    //Crafty.bind('EnterFrame', function () {
      //// TODO: Refactor this to be able to act on game pauses

      //var x = ((new Date()).getTime() - startTime) * gamespeed;
      //if (nextEnemySpawn < x) {
        //var y = Crafty.math.randomInt(40, 720);

        //Crafty.e('Enemy').enemy({ x: 1200, y: y });
        //nextEnemySpawn += Crafty.math.randomInt(100, 2000);
        //console.log('Time to spawn!');
      //}
    //});
  //});

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
