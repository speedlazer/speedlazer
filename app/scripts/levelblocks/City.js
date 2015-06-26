'use strict';

// Import
var generator = window.Game.levelGenerator;

generator.defineBlock('cityStart', {
  deltaX: 200,
  deltaY: 0,
  next: ['topFloor', 'openSpace'],
  generate: function () {
    this.add(0, 0, Crafty.e('2D, Canvas, Edge, Color').attr({ w: this.deltaX, h: 2 }));
    this.add(0, 700, Crafty.e('2D, Canvas, Edge, Color').attr({ w: this.deltaX, h: 2}));

    var title = Crafty.e('2D, DOM, Text, Tween, Delay').attr({ w: 750, z: 1 }).text('Stage ' + this.level.data.stage);
    var x = 400;
    this.add(x, 340, title);
    title.textColor('#FF0000')
      .textFont({
        size: '30px',
        weight: 'bold',
        family: 'Courier new'
      }).delay(function () {
        this.tween({ y: title.y + 500, alpha: 0 }, 3000);
      }, 3000, 0);

    this.bind('ViewportScroll', function () {
      title.attr({ x: x - Crafty.viewport._x });
    });
  }
});

generator.defineBlock('levelEnd', {
  deltaX: 1500,
  deltaY: 0,
  next: [],
  generate: function () {
    this.add(0, 0, Crafty.e('2D, Canvas, Edge, Color').attr({ w: 1500, h: 2 }));
    this.add(0, 700, Crafty.e('2D, Canvas, Edge, Color').attr({ w: 1500, h: 2}));
    var stopScrollWallTrigger = Crafty.e('2D, Canvas, Color, Collision')
      .attr({ w: 10, h: 700 })
      .onHit('ScrollWall', function () {
        Crafty('ScrollWall').each(function () {
          this.off();
        });
        this.destroy();
      });
    this.add(0, 0, stopScrollWallTrigger);

    var endLevelTrigger = Crafty.e('2D, Canvas, Color, Collision')
      .attr({ w: 10, h: 700 })
      .onHit('PlayerControlledShip', function () {
        Crafty.trigger('EndOfLevel');
        this.destroy();
      });
    this.add(1000, 0, endLevelTrigger);
  }
});

generator.defineBlock('openSpace', {
  deltaX: 1000,
  deltaY: 0,
  next: ['topFloor', 'openSpace'],
  supports: ['speed', 'cleared'],
  generate: function () {
    this.add(0, 0, Crafty.e('2D, Canvas, Edge, Color').attr({ w: 1000, h: 2 }));
    this.add(0, 700, Crafty.e('2D, Canvas, Edge, Color').attr({ w: 1000, h: 2}));
    this.add(400, 150, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr({ w: 42, h: 70 }));
    this.add(900, 50, Crafty.e('2D, Canvas, Edge, Color').color('#404045').attr({ w: 82, h: 70 }));
    this.add(600, 250, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr({ w: 52, h: 80 }));
    this.add(500, 450, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr({ w: 52, h: 40 }));
    this.add(800, 550, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 82, h: 30 }));
  }
});

generator.defineBlock('topFloor', {
  deltaX: 1000,
  deltaY: 0,
  next: ['tunnel', 'openSpace'],
  supports: ['speed', 'cleared'],
  generate: function () {
    this.add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 350, h: 30 }));
    this.add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 140 }));
    this.add(450, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 550, h: 50 }));
    this.add(0, 700, Crafty.e('2D, Canvas, Edge, Color').attr({ w: 1000, h: 2}));
    var only = this.settings.only || [];
    if (only.indexOf('cleared') === -1) {
      var self = this;
      var spawnEnemiesTrigger = Crafty.e('2D, Canvas, Color, Collision')
        .attr({ w: 10, h: 700 })
        .onHit('ScrollWall', function () {
          self.add(650, 300, Crafty.e('Enemy').enemy());
          self.add(1000 + (Math.random() * 50), 400 + (Math.random() * 150), Crafty.e('Enemy').enemy());
          self.add(1200 + (Math.random() * 50), 100 + (Math.random() * 250), Crafty.e('Enemy').enemy());
          self.add(1200 + (Math.random() * 250), 600 + (Math.random() * 100), Crafty.e('Enemy').enemy());

          this.destroy();
        });
      this.add(-700, 0, spawnEnemiesTrigger);
    }
  }
});

generator.defineBlock('tunnel', {
  deltaX: 1000,
  deltaY: 0,
  next: ['topFloor', 'tunnel', 'tunnelTwist'],
  supports: ['speed', 'cleared'],
  generate: function () {
    this.add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 350, h: 30 }));
    this.add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 140 }));
    this.add(450, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 550, h: 50 }));
    this.add(0, 670, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 350, h: 30 }));
    this.add(350, 560, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 140 }));
    this.add(450, 650, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 550, h: 50 }));

    var only = this.settings.only || [];
    if (only.indexOf('cleared') === -1) {
      var self = this;
      var spawnEnemiesTrigger = Crafty.e('2D, Canvas, Color, Collision')
        .attr({ w: 10, h: 700 })
        .onHit('ScrollWall', function () {
          self.add(1000 + (Math.random() * 50), 400 + (Math.random() * 150), Crafty.e('Enemy').enemy());
          self.add(1200 + (Math.random() * 50), 300 + (Math.random() * 250), Crafty.e('Enemy').enemy());
          self.add(1200 + (Math.random() * 250), 200 + (Math.random() * 100), Crafty.e('Enemy').enemy());

          this.destroy();
        });
      this.add(-700, 0, spawnEnemiesTrigger);
    }
  }
});

generator.defineBlock('tunnelTwist', {
  deltaX: 1000,
  deltaY: 0,
  next: ['tunnel', 'tunnelTwist'],
  supports: ['cleared'],
  generate: function () {
    this.add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 250, h: 30 }));
    this.add(250, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 440 }));
    this.add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 650, h: 50 }));

    this.add(0, 670, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 650, h: 30 }));
    this.add(650, 260, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 100, h: 440 }));
    this.add(750, 650, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({ w: 250, h: 50 }));
  }
});

generator.defineBlock('dialog', {
  deltaX: 0,
  deltaY: 0,
  next: [],
  generate: function () {
    var self = this;
    var startDialogTrigger = Crafty.e('2D, Canvas, Color, Collision')
      .attr({ w: 10, h: 700 })
      .onHit('ScrollWall', function () {
        for (var i = 0; i < self.settings.dialog.length; i++) {
          var dialog = self.settings.dialog[i];

          var players = [];
          Crafty('Player ControlScheme').each(function () {
            players.push(this.name);
          });
          var canShow = true;

          if (dialog.has !== undefined) {
            for (var p = 0; p < dialog.has.length; p++) {
              if (players.indexOf(dialog.has[p]) === -1) {
                canShow = false;
              }
            }
          }

          if (dialog.only !== undefined) {
            for (var p = 0; p < players.length; p++) {
              if (dialog.only.indexOf(players[p]) === -1) {
                canShow = false;
              }
            }
          }

          if (canShow === false) { continue; }
          console.log(dialog.name);
          for (var l = 0; l < dialog.lines.length; l++) {
            console.log(' ' + dialog.lines[l]);
          }
        }

        this.destroy();
      });
    this.add(-30, 0, startDialogTrigger);
  }
});
