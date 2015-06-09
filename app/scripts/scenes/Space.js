'use strict';

Crafty.defineScene('Space', function () {
  // constructor
  Crafty.background('#111');

  var showPlayerHud = function (playerIndex) {
    var x = 10 + (playerIndex * 350);
    var player = players[playerIndex].player;

    var score = Crafty.e('2D, Canvas, Text')
      .attr({ x: x, y: 10, w: 150 }).text('Score: ' + player.points)
      .textColor(player.color())
      .textFont({
        size: '20px',
        weight: 'bold',
        family: 'Courier new'
      });
    player.bind('UpdatePoints', function (e) {
      score.text('Score: ' + e.points);
    });

    var lives = Crafty.e('2D, Canvas, Text')
      .attr({ x: x, y: 30, w: 150 }).text('Lives: ' + player.lives)
      .textColor(player.color())
      .textFont({
        size: '20px',
        weight: 'bold',
        family: 'Courier new'
      });
    player.bind('UpdateLives', function (e) {
      if (e.lives === 0) {
        lives.text('Game Over');
      } else {
        lives.text('Lives: ' + e.lives);
      }
    });

    players[playerIndex].score = score;
    players[playerIndex].lives = lives;
  };



  Crafty.e('Keyboard')
    .bind('KeyDown', function (e) {
      if (e.key === Crafty.keys.SPACE) {
        spawnPlayer('keyboard', 1);
        this.destroy();
      }
    });
  Crafty.e('Gamepad')
    .gamepad(0)
    .bind('GamepadKeyChange', function (e) {
      if (e.button === 0 && e.pressed) {
        spawnPlayer('gamepad', 0);
        this.destroy();
      }
    });
  Crafty.e('Gamepad')
    .gamepad(1)
    .bind('GamepadKeyChange', function (e) {
      if (e.button === 0 && e.pressed) {
        spawnPlayer('gamepad', 1);
        this.destroy();
      }
    });

  var players = [];
  var playerColors = ['#F00', '#0F0', '#F0F'];

  var spawnPlayer = function (controlType, controlIndex) {
    var player = Crafty.e('Player')
      .attr({ x: 140, y: 320, playerIndex: players.length })
      .color(playerColors[players.length]);

    players.push({
      controlType: controlType,
      controlIndex: controlIndex,
      player: player
    });
    showPlayerHud(players.length - 1);
    Crafty.trigger('PlayerStart', player);

    if (controlType === 'keyboard') {
      if (controlIndex === 1) {
        player.addComponent('Multiway, Keyboard')
          .multiway({ y: 3, x: 1 }, {
            UP_ARROW: -90,
            DOWN_ARROW: 90,
            LEFT_ARROW: 180,
            RIGHT_ARROW: 0
          })
          .bind('KeyDown', function (e) {
            if (e.key === Crafty.keys.SPACE) { this.shoot(); }
          });
      }
    }
    if (controlType === 'gamepad') {
      player.addComponent('GamepadMultiway, Gamepad')
        .gamepad(controlIndex)
        .gamepadMultiway({
          speed: { y: 3, x: 1 },
          gamepadIndex: controlIndex
        })
        .bind('GamepadKeyChange', function (e) {
          if (e.button === 0 && e.pressed) { this.shoot(); }
        });
    }
  };

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
  var nextEnemySpawn = 5000;
  var startTime = null;
  Crafty.bind('PlayerStart', function () {
    if (players.length === 1) {
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
    }
  });

  Crafty.bind('PlayerDied', function () {
    Crafty.enterScene('GameOver', { score: 'later!' });
  });

}, function () {
  // destructor
  Crafty.unbind('EnterFrame');
});
