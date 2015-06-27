(function() {
  var CityStart, LevelEnd, OpenSpace, TopFloor, Tunnel, TunnelTwist, generator,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  generator = this.Game.levelGenerator;

  generator.defineBlock(CityStart = (function(superClass) {
    extend(CityStart, superClass);

    function CityStart() {
      return CityStart.__super__.constructor.apply(this, arguments);
    }

    CityStart.prototype.name = 'CityStart';

    CityStart.prototype.delta = {
      x: 200,
      y: 0
    };

    CityStart.prototype.next = ['OpenSpace'];

    CityStart.prototype.generate = function() {
      this.add(0, 0, Crafty.e('2D, Canvas, Edge').attr({
        w: this.delta.x,
        h: 2
      }));
      return this.add(0, 700, Crafty.e('2D, Canvas, Edge').attr({
        w: this.delta.x,
        h: 2
      }));
    };

    CityStart.prototype.enter = function() {
      var title, x;
      CityStart.__super__.enter.apply(this, arguments);
      title = Crafty.e('2D, DOM, Text, Tween, Delay').attr({
        w: 750,
        z: 1
      }).text('Stage ' + this.level.data.stage);
      x = 400;
      this.add(x, 340, title);
      title.textColor('#FF0000').textFont({
        size: '30px',
        weight: 'bold',
        family: 'Courier new'
      }).delay(function() {
        return this.tween({
          y: title.y + 500,
          alpha: 0
        }, 3000);
      }, 3000, 0);
      return this.bind('ViewportScroll', function() {
        return title.attr({
          x: x - Crafty.viewport._x
        });
      });
    };

    return CityStart;

  })(this.Game.LevelBlock));

  generator.defineBlock(LevelEnd = (function(superClass) {
    extend(LevelEnd, superClass);

    function LevelEnd() {
      return LevelEnd.__super__.constructor.apply(this, arguments);
    }

    LevelEnd.prototype.name = 'LevelEnd';

    LevelEnd.prototype.delta = {
      x: 1500,
      y: 0
    };

    LevelEnd.prototype.next = [];

    LevelEnd.prototype.generate = function() {
      this.add(0, 0, Crafty.e('2D, Canvas, Edge, Color').attr({
        w: 1500,
        h: 2
      }));
      return this.add(0, 700, Crafty.e('2D, Canvas, Edge, Color').attr({
        w: 1500,
        h: 2
      }));
    };

    LevelEnd.prototype.inScreen = function() {
      var endLevelTrigger;
      Crafty('ScrollWall').each(function() {
        return this.off();
      });
      endLevelTrigger = Crafty.e('2D, Canvas, Color, Collision').attr({
        w: 10,
        h: 700
      }).onHit('PlayerControlledShip', function() {
        Crafty.trigger('EndOfLevel');
        return this.destroy();
      });
      return this.add(1000, 0, endLevelTrigger);
    };

    return LevelEnd;

  })(this.Game.LevelBlock));

  generator.defineBlock(OpenSpace = (function(superClass) {
    extend(OpenSpace, superClass);

    function OpenSpace() {
      return OpenSpace.__super__.constructor.apply(this, arguments);
    }

    OpenSpace.prototype.name = 'OpenSpace';

    OpenSpace.prototype.delta = {
      x: 1000,
      y: 0
    };

    OpenSpace.prototype.next = ['OpenSpace', 'TopFloor'];

    OpenSpace.prototype.supports = ['speed', 'cleared'];

    OpenSpace.prototype.generate = function() {
      this.add(0, 0, Crafty.e('2D, Canvas, Edge, Color').attr({
        w: 1000,
        h: 2
      }));
      this.add(0, 700, Crafty.e('2D, Canvas, Edge, Color').attr({
        w: 1000,
        h: 2
      }));
      this.add(400, 150, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr({
        w: 42,
        h: 70
      }));
      this.add(900, 50, Crafty.e('2D, Canvas, Edge, Color').color('#404045').attr({
        w: 82,
        h: 70
      }));
      this.add(600, 250, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr({
        w: 52,
        h: 80
      }));
      this.add(500, 450, Crafty.e('2D, Canvas, Edge, Color').color('#505045').attr({
        w: 52,
        h: 40
      }));
      return this.add(800, 550, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 82,
        h: 30
      }));
    };

    return OpenSpace;

  })(this.Game.LevelBlock));

  generator.defineBlock(TopFloor = (function(superClass) {
    extend(TopFloor, superClass);

    function TopFloor() {
      return TopFloor.__super__.constructor.apply(this, arguments);
    }

    TopFloor.prototype.name = 'TopFloor';

    TopFloor.prototype.delta = {
      x: 1000,
      y: 0
    };

    TopFloor.prototype.next = ['OpenSpace', 'Tunnel'];

    TopFloor.prototype.supports = ['speed', 'cleared'];

    TopFloor.prototype.generate = function() {
      this.add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 350,
        h: 30
      }));
      this.add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 100,
        h: 140
      }));
      this.add(450, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 550,
        h: 50
      }));
      return this.add(0, 700, Crafty.e('2D, Canvas, Edge, Color').attr({
        w: 1000,
        h: 2
      }));
    };

    TopFloor.prototype.enter = function() {
      var only;
      only = this.settings.only || [];
      if (only.indexOf('cleared') === -1) {
        this.add(650, 300, Crafty.e('Enemy').enemy());
        this.add(1000 + (Math.random() * 50), 400 + (Math.random() * 150), Crafty.e('Enemy').enemy());
        this.add(1200 + (Math.random() * 50), 100 + (Math.random() * 250), Crafty.e('Enemy').enemy());
        return this.add(1200 + (Math.random() * 250), 600 + (Math.random() * 100), Crafty.e('Enemy').enemy());
      }
    };

    return TopFloor;

  })(this.Game.LevelBlock));

  generator.defineBlock(Tunnel = (function(superClass) {
    extend(Tunnel, superClass);

    function Tunnel() {
      return Tunnel.__super__.constructor.apply(this, arguments);
    }

    Tunnel.prototype.name = 'Tunnel';

    Tunnel.prototype.delta = {
      x: 1000,
      y: 0
    };

    Tunnel.prototype.next = ['TopFloor', 'Tunnel'];

    Tunnel.prototype.supports = ['speed', 'cleared'];

    Tunnel.prototype.generate = function() {
      this.add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 350,
        h: 30
      }));
      this.add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 100,
        h: 140
      }));
      this.add(450, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 550,
        h: 50
      }));
      this.add(0, 670, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 350,
        h: 30
      }));
      this.add(350, 560, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 100,
        h: 140
      }));
      return this.add(450, 650, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 550,
        h: 50
      }));
    };

    Tunnel.prototype.enter = function() {
      var only;
      only = this.settings.only || [];
      if (only.indexOf('cleared') === -1) {
        this.add(1000 + (Math.random() * 50), 400 + (Math.random() * 150), Crafty.e('Enemy').enemy());
        this.add(1200 + (Math.random() * 50), 300 + (Math.random() * 250), Crafty.e('Enemy').enemy());
        return this.add(1200 + (Math.random() * 250), 200 + (Math.random() * 100), Crafty.e('Enemy').enemy());
      }
    };

    return Tunnel;

  })(this.Game.LevelBlock));

  generator.defineBlock(TunnelTwist = (function(superClass) {
    extend(TunnelTwist, superClass);

    function TunnelTwist() {
      return TunnelTwist.__super__.constructor.apply(this, arguments);
    }

    TunnelTwist.prototype.name = 'TunnelTwist';

    TunnelTwist.prototype.delta = {
      x: 1000,
      y: 0
    };

    TunnelTwist.prototype.next = ['TunnelTwist', 'Tunnel'];

    TunnelTwist.prototype.supports = ['cleared'];

    TunnelTwist.prototype.generate = function() {
      this.add(0, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 250,
        h: 30
      }));
      this.add(250, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 100,
        h: 440
      }));
      this.add(350, 0, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 650,
        h: 50
      }));
      this.add(0, 670, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 650,
        h: 30
      }));
      this.add(650, 260, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 100,
        h: 440
      }));
      return this.add(750, 650, Crafty.e('2D, Canvas, Edge, Color').color('#404040').attr({
        w: 250,
        h: 50
      }));
    };

    return TunnelTwist;

  })(this.Game.LevelBlock));


  /*
  
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
   */

}).call(this);
