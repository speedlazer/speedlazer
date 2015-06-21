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


  // Orchestrate level generation:
  var generationPosition = {
    x: 0,
    y: 50
  }

  var levelBlocks = [];


  var generateBlock = function(pos) {
    var variant = Math.floor(Math.random() * 3);

    console.log(variant);
    // Top
    if (variant === 0) {
      Crafty.e('2D, Canvas, Edge, Color')
        .attr({ x: pos.x, y: pos.y, w: 1000, h: 2 });

      Crafty.e('2D, Canvas, Edge, Color')
        .attr({x: pos.x, y: pos.y + 700, w: 1000, h: 2});

      Crafty.e('2D, Canvas, Edge, Color')
        .color('#505045')
        .attr({x: pos.x + 400, y: pos.y + 150, w: 42, h: 70 });

      Crafty.e('2D, Canvas, Edge, Color')
        .color('#404040')
        .attr({x: pos.x + 800, y: pos.y + 550, w: 82, h: 30 });

      pos.x += 1000;
    } else if (variant === 1) {
      Crafty.e('2D, Canvas, Edge, Color')
        .color('#404040')
        .attr({ x: pos.x, y: pos.y, w: 350, h: 30 });

      Crafty.e('2D, Canvas, Edge, Color')
        .color('#404040')
        .attr({ x: pos.x + 350, y: pos.y, w: 100, h: 140 });

      Crafty.e('2D, Canvas, Edge, Color')
        .color('#404040')
        .attr({ x: pos.x + 450, y: pos.y, w: 550, h: 50 });

      Crafty.e('2D, Canvas, Edge, Color')
        .attr({x: pos.x, y: pos.y + 700, w: 1000, h: 2});

      pos.x += 1000;
    } else if (variant === 2) {
      Crafty.e('2D, Canvas, Edge, Color')
        .color('#404040')
        .attr({ x: pos.x, y: pos.y, w: 350, h: 30 });

      Crafty.e('2D, Canvas, Edge, Color')
        .color('#404040')
        .attr({ x: pos.x + 350, y: pos.y, w: 100, h: 140 });

      Crafty.e('2D, Canvas, Edge, Color')
        .color('#404040')
        .attr({ x: pos.x + 450, y: pos.y, w: 550, h: 50 });


      Crafty.e('2D, Canvas, Edge, Color')
        .color('#404040')
        .attr({ x: pos.x, y: pos.y + 670, w: 350, h: 30 });

      Crafty.e('2D, Canvas, Edge, Color')
        .color('#404040')
        .attr({ x: pos.x + 350, y: pos.y + 560, w: 100, h: 140 });

      Crafty.e('2D, Canvas, Edge, Color')
        .color('#404040')
        .attr({ x: pos.x + 450, y: pos.y + 650, w: 550, h: 50 });
      pos.x += 1000;
    }
  };

  for (var i = 0; i < 10; i++) {
    generateBlock(generationPosition);
  }



  // Let walls absorb bullets
  Crafty('Edge').each(function () {
    this.addComponent('Collision').onHit('Bullet', function (e) {
      var bullet = e[0].obj;
      bullet.destroy();
    });
  });


  Crafty.c('ScrollWall', {
    init: function () {
      this.requires('2D, Canvas, Color, Edge, Collision');
      this.attr({ x: 0, y: 50, w: 2, h: 710 });
      this.color('#FFFF00');

      this.bind('EnterFrame', function () {
        //var maxX = levelSize.w - Crafty.viewport.width;
        //if (maxX < this.x) {
          //Crafty.trigger('EndOfLevel');
          //console.log('EndOfLevel');
          //this.unbind('EnterFrame');
          //return;
        //}

        var speed = 1;
        Crafty('PlayerControlledShip').each(function () {
          var margin = Crafty.viewport.width / 3.0;
          if (this.x >  (- (Crafty.viewport.x - Crafty.viewport.width)) - margin) {
            speed = 3;
          }
        });
        this.x += speed;
        Crafty.viewport.scroll('_x', -this.x);
        Crafty.viewport._clamp();
      });
      this.onHit('PlayerControlledShip', function (e) {
        for (var i = 0; i < e.length; i++) {
          var p = e[i].obj;
          p.attr({ x: p.x + 1 });
        }
      });
    }
  });

  Crafty.one('PlayerActivated', function () {
    // start moving the camera (maybe a 'ScrollWall' component?)
    Crafty.e('ScrollWall')

    //var p = Crafty(Crafty('PlayerControlledShip')[0]);
    //Crafty.viewport.follow(p);

  });

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
