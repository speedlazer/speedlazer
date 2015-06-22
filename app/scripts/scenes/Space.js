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


  var buildingBlocks = {
    openSpace: {
      deltaX: 1000,
      deltaY: 0,
      next: ['topFloor', 'openSpace'],
      generate: function () {
        Crafty.e('2D, Canvas, Edge, Color')
          .attr({ x: this.x, y: this.y, w: 1000, h: 2 });

        Crafty.e('2D, Canvas, Edge, Color')
          .attr({x: this.x, y: this.y + 700, w: 1000, h: 2});

        Crafty.e('2D, Canvas, Edge, Color')
          .color('#505045')
          .attr({x: this.x + 400, y: this.y + 150, w: 42, h: 70 });

        Crafty.e('2D, Canvas, Edge, Color')
          .color('#404040')
          .attr({x: this.x + 800, y: this.y + 550, w: 82, h: 30 });
      }
    },
    topFloor: {
      deltaX: 1000,
      deltaY: 0,
      next: ['tunnel', 'openSpace'],
      generate: function () {
        Crafty.e('2D, Canvas, Edge, Color')
          .color('#404040')
          .attr({ x: this.x, y: this.y, w: 350, h: 30 });

        Crafty.e('2D, Canvas, Edge, Color')
          .color('#404040')
          .attr({ x: this.x + 350, y: this.y, w: 100, h: 140 });

        Crafty.e('2D, Canvas, Edge, Color')
          .color('#404040')
          .attr({ x: this.x + 450, y: this.y, w: 550, h: 50 });

        Crafty.e('2D, Canvas, Edge, Color')
          .attr({x: this.x, y: this.y + 700, w: 1000, h: 2});
      }
    },
    tunnel: {
      deltaX: 1000,
      deltaY: 0,
      next: ['topFloor', 'tunnel'],
      generate: function () {
        Crafty.e('2D, Canvas, Edge, Color')
          .color('#404040')
          .attr({ x: this.x, y: this.y, w: 350, h: 30 });

        Crafty.e('2D, Canvas, Edge, Color')
          .color('#404040')
          .attr({ x: this.x + 350, y: this.y, w: 100, h: 140 });

        Crafty.e('2D, Canvas, Edge, Color')
          .color('#404040')
          .attr({ x: this.x + 450, y: this.y, w: 550, h: 50 });


        Crafty.e('2D, Canvas, Edge, Color')
          .color('#404040')
          .attr({ x: this.x, y: this.y + 670, w: 350, h: 30 });

        Crafty.e('2D, Canvas, Edge, Color')
          .color('#404040')
          .attr({ x: this.x + 350, y: this.y + 560, w: 100, h: 140 });

        Crafty.e('2D, Canvas, Edge, Color')
          .color('#404040')
          .attr({ x: this.x + 450, y: this.y + 650, w: 550, h: 50 });
      }
    }
  }

  var cleanupFunction = function () {
    for (var i = 0; i < this.createdElements.length; i++) {
      this.createdElements[i].destroy();
    }
  };

  var notifyEnterFunction = function () {
    var tileIndex = this.index;
    Crafty.e('2D, Canvas, Color, Collision')
      .attr({ x: this.x, y: this.y, w: 10, h: 800 })
      .color('#FF00FF')
      .onHit('ScrollWall', function () {
        Crafty.trigger('EnterBlock', tileIndex);
        this.destroy();
      });
  }

  var levelGenerator = {
    levelPieces: [],
    bufferLength: 3,

    generationPosition: {
      x: 0,
      y: 50
    },

    generateLevel: function (start, length) {
      var tileType = start;
      for (var i = 0; i < length; i++) {
        this.levelPieces.push({
          index: i,
          tileType: tileType,
          generated: false,
          createdElements: [],
        });
        var candidates = buildingBlocks[tileType].next;
        tileType = candidates[Math.floor(Math.random() * candidates.length)];
      }
    },

    updateLevel: function (start) {
      var end = start + this.bufferLength;
      if (end >= this.levelPieces.length) {
        end = this.levelPieces.length - 1;
      }
      for (var i = start; i < end; i++) {
        var piece = this.levelPieces[i];
        piece.x = piece.x || this.generationPosition.x;
        piece.y = piece.y || this.generationPosition.y;

        this.generationPosition.x = piece.x + buildingBlocks[piece.tileType].deltaX;
        this.generationPosition.y = piece.y + buildingBlocks[piece.tileType].deltaY;
        if (!piece.generated) {
          buildingBlocks[piece.tileType].generate.call(piece);
          notifyEnterFunction.call(piece);
          piece.generated = true;
        }
      }
      if (start - (2 * this.bufferLength) < 0) {
        return;
      }
      for (var i = start - (2 * this.bufferLength); i < start; i++) {
        var piece = this.levelPieces[i];
        cleanupFunction.call(piece);
      }
    }
  };

  levelGenerator.generateLevel('openSpace', 10);
  levelGenerator.updateLevel(0);

  Crafty.bind('EnterBlock', function (index) {
    levelGenerator.updateLevel(index);
  });

  Crafty.c('ScrollWall', {
    init: function () {
      this.requires('2D, Canvas, Color, Edge, Collision');
      this.attr({ x: 0, y: 50, w: 2, h: 710, speed: { x: 0, y: 0 } });
      this.color('#FFFF00');
      this._speed = { x: 0, y: 0 };

      this.bind('EnterFrame', function () {
        var speedX = this._speed.x;
        Crafty('PlayerControlledShip').each(function () {
          var margin = Crafty.viewport.width / 3.0;
          if (this.x >  (- (Crafty.viewport.x - Crafty.viewport.width)) - margin) {
            speedX += 2;
          }
        });
        this.x += speedX;
        Crafty.viewport.scroll('_x', -this.x);
        Crafty.viewport._clamp();
      });
      this.onHit('PlayerControlledShip', function (e) {
        // Push the player forward
        for (var i = 0; i < e.length; i++) {
          var p = e[i].obj;
          p.attr({ x: p.x + this._speed.x });
        }
      });
    },
    scrollWall: function (speed) {
      if (speed.x !== undefined && speed.y !== undefined) {
          this._speed.x = speed.x;
          this._speed.y = speed.y;
      } else {
          this._speed.x = speed;
          this._speed.y = speed;
      }
      return this;
    }
  });

  Crafty.one('PlayerActivated', function () {
    // start moving the camera (maybe a 'ScrollWall' component?)
    Crafty.e('ScrollWall'); // .scrollWall(1);

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
  Crafty.unbind('EnterBlock');
});
