Crafty.c("BezierMove", {
  events: {
    GameLoop: "_moveBezierTick"
  },

  remove() {
    if (this.bezierTimer.complete) return;
    this.trigger("BezierMoveEnd");
  },

  bezierMove(path, settings) {
    const speed = settings.speed || this.defaultSpeed;
    const duration = path.length / speed * 1000;

    this.bezierTimer = new Crafty.easing(duration, settings.easing || "linear");
    this.bezierPath = path;
  },

  _moveBezierTick(fd) {
    if (this.bezierTimer.complete) return;
    this.bezierTimer.tick(fd.dt);
    this._doMove(this.bezierTimer.value(), fd);
    if (this.bezierTimer.complete) {
      this.trigger("BezierMoveEnd");
    }
  },

  _doMove(pt, fd) {
    const point = this.bezierPath.get(pt);
    const dx = point.x - this.x;
    const dy = point.y - this.y;
    if (this.updateMovementVisuals) {
      const rotation = 0;
      this.updateMovementVisuals(rotation, dx, dy, fd.dt);
    }
    this.shift(dx, dy);
  }
});
