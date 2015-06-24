'use strict';

Crafty.defineScene('Intro', function () {
  // constructor
  Crafty.background('#111');
  Crafty.viewport.x = 0;
  Crafty.viewport.y = 0;

  Crafty.e('2D, DOM, Text, Tween, Delay').attr({ x: 200, y: 210, w: 450 }).text('Speedlazer')
    .textColor('#0000ff')
    .textFont({
      size: '80px',
      weight: 'bold',
      family: 'Courier new'
    }).delay(function () {
      this.tween({ x: 300 }, 1000);
      this.one('TweenEnd', function () {
        this.tween({ x: 200 }, 1000);
      });

    }, 2000, -1);

  Crafty.e('2D, DOM, Text, Tween, Delay').attr({ x: 300, y: 490, w: 750 }).text('Press fire to start!')
    .textColor('#FF0000')
    .textFont({
      size: '30px',
      weight: 'bold',
      family: 'Courier new'
    }).delay(function () {
      this.tween({ alpha: 0 }, 1000);
      this.one('TweenEnd', function () {
        this.tween({ alpha: 1 }, 1000);
      });

    }, 2000, -1);
  Crafty('Player').each(function () {
    // Turn this into a more generic 'reset player'
    this.removeComponent('ControlScheme')
      .attr({
        lives: 2,
        points: 0
      });
    this.one('Activated', function () {
      Crafty.enterScene('Space', { stage: 1 });
    });
  });

}, function () {
  // destructor
  Crafty('Player').each(function () {
    this.unbind('Activated');
  });
});
