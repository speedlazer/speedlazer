Crafty.c('Enemy', {
  init: function() {
    this.addComponent('2D, Canvas, Color, Collision')
  },
  enemy: function(attr) {
    this.attr({ x: attr.x, y: attr.y, w: 50, h: 50, health: 300 })
      .color('#00F')
      .bind('EnterFrame', function() {
          this.x = this.x - 2;
          if (this.x < -100) {
            this.destroy()
            console.log('Uhoh')
          }
      })
      .onHit('Bullet', function(e) {
        var bullet = e[0].obj;
        bullet.trigger('HitTarget', { target: this });
        this.health -= bullet.damage;
        if (this.health <= 0) {
          bullet.trigger('DestroyTarget', { target: this });
          this.destroy()
        }
        bullet.destroy();
      });
  }
});


