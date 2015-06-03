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

  var player = Crafty.e('2D, Canvas, Color, Multiway, GamepadMultiway, Keyboard, Gamepad')
    .attr({x: 40, y: 30, w: 30, h: 30})
    .color('#F00')
    .multiway(3, {
      UP_ARROW: -90,
      DOWN_ARROW: 90
    })
    .gamepadMultiway({
      speed: { y: 3, x: 0.000001 },
      gamepadIndex: 0
    })

  player.addComponent('Collision')
  player.bind('Moved', function(from) {
    if (this.hit('Edge')) {
      this.attr({x: from.x, y: from.y})
    }
  });

  player.bind("KeyDown", function(e) {
    if (e.key == Crafty.keys.SPACE) {
      this.shoot()
    };
  });
  player.bind('GamepadKeyChange', function (e) {
    if (e.button === 0 && e.pressed) {
      this.shoot()
    }
  });

  player.shoot = function() {
    Crafty.e('Bullet').fireFrom(this.x, this.y)
  }

  Crafty.e('2D, Canvas, Edge')
    .attr({x: 30, y: 20, w: 50, h: 2})

  Crafty.e('2D, Canvas, Edge')
    .attr({x: 30, y: 750, w: 50, h: 2})


}, function() {
  // destructor
});
