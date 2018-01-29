import createEntityPool from 'src/lib/entityPool';


Crafty.s("Wind", {
  events: {
    "CameraMove": "_updateSpeed",
  },

  init() {
    this._active = false;
    this._cooldown = 0;
    this.particlePool = createEntityPool(
      () => (
        Crafty.e('2D, WebGL, GameParticle, PausableMotion, Color, Tween')
          .color('#FFFFFF')
      ),
      20
    )
  },

  emitWindParticles() {
    this._active = true;
  },

  stopWindParticles() {
    this._active = false;
  },

  _updateSpeed(props) {
    const { dx, dy, dt } = props;
    if (this._active === false) {
      return;
    }

    this._cooldown -= dt;
    if (this._cooldown > 0) {
      return;
    }
    this._cooldown = 300

    const speed = Math.min(dx + dy, 12.0) / 12.0;
    const vx = (dx * (1000.0 / dt));

    this.particlePool.get()
      .attr({
        x: (Crafty.viewport.width * Math.random()) + vx,
        y: (Crafty.viewport.height * Math.random()),
        alpha: 0.01,
        w: 1 + (dx + dy) * 3,
        h: (dy + dx) / 2,
        vx: -vx,
      })
      .one('ParticleEnded', (e) => this.particlePool.recycle(e))
      .one('TweenEnd', function() {
        this.tween({
          alpha: 0,
        }, 750)
      })
      .tween({
        alpha: speed,
      }, 750)
      .particle({
        duration: 1500
      })
  }

});

