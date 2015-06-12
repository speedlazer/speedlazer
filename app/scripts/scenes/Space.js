'use strict';

Crafty.defineScene('Space', function () {
  // constructor
  Crafty.background('#000');

  Crafty.e('Player, Color, HUD')
    .setName('Player 1')
    .color('#FF0000')
    .hud(10);

  Crafty.e('Player, Color, HUD')
    .setName('Player 2')
    .color('#00FF00')
    .hud(400);

  var playerWithoutControls = function () {
    var players = Crafty('Player');
    for (var i = 0; i < players.length; i++) {
      var player = Crafty(players[i]);
      if (!player.has('ControlScheme')) {
        return player;
      }
    }
  }
  var assignControls = function () {
    var player = playerWithoutControls();
    if (player === undefined) { return; }

    player
      .addComponent('ControlScheme');
    this.setupControls(player);
    player.trigger('Activated');
    this.destroy();
  }

  Crafty.e('KeyboardControls')
    .controls({
      fire: Crafty.keys.SPACE,
      up: Crafty.keys.UP_ARROW,
      down: Crafty.keys.DOWN_ARROW,
      left: Crafty.keys.LEFT_ARROW,
      right: Crafty.keys.RIGHT_ARROW
    })
    .one('Fire', assignControls);

  Crafty.e('KeyboardControls')
    .controls({
      fire: Crafty.keys.G,
      up: Crafty.keys.W,
      down: Crafty.keys.S,
      left: Crafty.keys.A,
      right: Crafty.keys.D
    })
    .one('Fire', assignControls);

  Crafty.e('GamepadControls')
    .controls({
      gamepadIndex: 0,
      fire: 0
    })
    .one('Fire', assignControls);

  Crafty.e('GamepadControls')
    .controls({
      gamepadIndex: 1,
      fire: 0
    })
    .one('Fire', assignControls);


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
    var players = [];
    Crafty('Player').each(function () {
      if (this.has('ControlScheme')) {
        players.push({
          name: this._entityName,
          color: this.color(),
          score: this.points
        });
        if (this.lives > 0) { playersActive = true; }
      }
    });
    if (playersActive === false) {
      Crafty.enterScene('GameOver', { results: players });
    }
  });

}, function () {
  // destructor
  Crafty.unbind('EnterFrame');
});
