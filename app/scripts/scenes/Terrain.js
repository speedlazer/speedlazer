Crafty.defineScene('Terrain', function() {
  // constructor
  Crafty.background('#080');

  Crafty.c('Bullet', {
    init: function() {
      this.addComponent('2D, Canvas, Color')
    },
    fireFrom: function(x, y) {
      this.attr({ x: x + 40, y: y + 10, w: 5, h: 5})
        .color('#F00')
        .bind('EnterFrame', function() {
            this.x = this.x + 3;
            if (this.x > 1200) {
              this.destroy()
            }
        });
    }
  });

  Crafty.c('Enemy', {
    init: function() {
      this.addComponent('2D, Canvas, Color, Collision')
    },
    enemy: function(attr) {
      this.attr({ x: attr.x, y: attr.y, w: 50, h: 50 })
        .color('#00F')
        .bind('EnterFrame', function() {
            this.x = this.x - 2;
            if (this.x < 0) {
              this.destroy()
              console.log('Uhoh')
            }
        }).onHit('Bullet', function(e) {
          e[0].obj.destroy() // destroy the bullet that shot me
          this.destroy()
        });
    }
  });

  var player = Crafty.e('2D, Canvas, Color, Multiway, GamepadMultiway, Keyboard, Gamepad, Collision')
    .attr({x: 40, y: 30, w: 30, h: 30})
    .color('#F00')
    .multiway({ y: 3, x: 0.5 }, {
      UP_ARROW: -90,
      DOWN_ARROW: 90,
      LEFT_ARROW: 180,
      RIGHT_ARROW: 0
    })
    .gamepadMultiway({
      speed: { y: 3, x: 0.5 },
      gamepadIndex: 0
    })
    .bind('Moved', function(from) {
      if (this.hit('Edge')) { // Contain player within playfield
        this.attr({x: from.x, y: from.y})
      }
    })
    .bind("KeyDown", function(e) {
      if (e.key == Crafty.keys.SPACE) { this.shoot() }
    })
    .bind('GamepadKeyChange', function (e) {
      if (e.button === 0 && e.pressed) { this.shoot() }
    });

  player.shoot = function() {
    Crafty.e('Bullet').fireFrom(this.x, this.y)
  }

  // Create edges around playfield to 'capture' the player
  Crafty.e('2D, Canvas, Edge')
    .attr({x: 10, y: 20, w: 900, h: 2})

  Crafty.e('2D, Canvas, Edge')
    .attr({x: 10, y: 750, w: 900, h: 2})

  Crafty.e('2D, Canvas, Edge')
    .attr({x: 10, y: 20, w: 2, h: 730 })

  Crafty.e('2D, Canvas, Edge')
    .attr({x: 910, y: 20, w: 2, h: 730 })


  var startTime = new Date().getTime()
  var enemies = [{
    y: 120,
    time: 5000
  }, {
    y: 450,
    time: 5500
  }]
  var spawnIndex = 0;

  Crafty.bind('EnterFrame', function() {
    if (spawnIndex >= enemies.length) return;
    if (enemies[spawnIndex].time + startTime < (new Date()).getTime()) {
      info = enemies[spawnIndex]
      spawnIndex += 1;
      Crafty.e('Enemy').enemy({ x: 1200, y: info.y })
      console.log('Time to spawn!')

    }
  })

}, function() {
  // destructor
});
