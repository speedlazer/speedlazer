'use strict';

Crafty.c('Player', {
  lives: 2,
  points: 0,
  init: function () {
    this.requires('Model'); // Not in this version of Crafty yet...
    this.bind('Activated', function () {
      Crafty.trigger('PlayerActivated');
      this.spawnShip();
    });
  },
  spawnShip: function () {
    if (this.lives <= 0) return;

    var _this = this;
    this.ship = Crafty.e('PlayerControlledShip')
      .attr({ x: 140, y: 320 });
    if (this.has('Color')) this.ship.color(this.color());
    if (this.has('ControlScheme')) this.assignControls(this.ship);

    this.ship
      .bind('BulletHit', function () {
        _this.addPoints(10);
      })
      .bind('BulletDestroyedTarget', function () {
        _this.addPoints(50);
      })
      .bind('Hit', function () {
        _this.loseLife();
      });
    return this;
  },
  loseLife: function () {
    this.ship.destroy();

    if (this.lives <= 0) return;
    this.lives -= 1;
    this.trigger('UpdateLives', { lives: this.lives });

    if (this.lives <= 0) {
      Crafty.trigger('PlayerDied', this);
    } else {
      this.spawnShip();
    }
  },
  addPoints: function (amount) {
    // Debatable should you get points for a target
    // that gets destroyed after you self died?
    if (this.lives <= 0) return;

    this.points += amount;
    this.trigger('UpdatePoints', { points: this.points });
  }
});

Crafty.c('KeyboardControls', {
  init: function() {
    this.one('Fire', function () {
      if (!this.has('Player')) {
        var players = Crafty('Player');
        for (var i = 0; i < players.length; i++) {
          var player = Crafty(players[i]);
          if (!player.has('ControlScheme')) {
            player
              .addComponent('ControlScheme')
              .addComponent('KeyboardControls')
              .controls(this.controlMap)
            player.trigger('Activated')
            this.destroy();
            break;
          }
        }
      }
    });
  },
  controls: function (controlMap) {
    this.controlMap = controlMap;
    this.bind('KeyDown', function (e) {
      if (e.key === this.controlMap.fire) {
        this.trigger('Fire', e);
      }
    });
  },
  assignControls: function (ship) {
    var controlMap = this.controlMap;

    var movementMap = {}
    movementMap[controlMap.up] = -90;
    movementMap[controlMap.down] = 90;
    movementMap[controlMap.left] = 180;
    movementMap[controlMap.right] = 0;

    ship.addComponent('Multiway, Keyboard')
      .multiway({ y: 3, x: 1 }, movementMap)
      .bind('KeyDown', function (e) {
        if (e.key === controlMap.fire) { this.shoot(); }
      });
  }
});

Crafty.c('HUD', {
  hud: function (x) {
    var score = Crafty.e('2D, DOM, Text')
      .attr({ x: x, y: 10, w: 150, h: 20})
      .textFont({
        size: '20px',
        weight: 'bold',
        family: 'Courier new'
      });
    if (this.has('Color')) score.textColor(this.color())

    var lives = Crafty.e('2D, DOM, Text')
      .attr({ x: x, y: 30, w: 250, h: 20 })
      .textFont({
        size: '20px',
        weight: 'bold',
        family: 'Courier new'
      });
    if (this.has('Color')) lives.textColor(this.color())

    var updateText = function () {
      if (this.has('ControlScheme')) {
        score.text('Score: ' + this.points);
      } else {
        score.text(this._entityName);
      }
      if (this.has('ControlScheme')) {
        if (this.lives === 0) {
          lives.text('Game Over');
        } else {
          lives.text('Lives: ' + this.lives);
        }
      } else {
        lives.text('Press fire to start!');
      }
    };

    updateText.call(this);

    this.bind('UpdateLives', updateText);
    this.bind('UpdatePoints', updateText);
    this.bind('Activated', updateText);

    return this;
  }
});
