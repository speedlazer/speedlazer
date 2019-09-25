import { getBezierPath } from "src/lib/BezierPath";

Crafty.c("WayPointMotion", {
  flyPattern(pattern, velocity, easing = "linear") {
    this.pattern = pattern;

    const vpw = Crafty.viewport.width;
    const vph = Crafty.viewport.height;
    const normalizedPath = pattern.map(({ x, y }) => ({
      x: x * vpw,
      y: y * vph
    }));
    this.bezierPath = getBezierPath(normalizedPath);
    const duration = this.bezierPath.length / velocity;

    this.wayPointEasing = new Crafty.easing(duration * 1000, easing);

    if (!this.inMotion) {
      this.inMotion = true;
      this.bind("EnterFrame", this.updateAcceleration);
    }

    return this;
  },

  stopFlyPattern() {
    if (this.inMotion) {
      this.unbind("EnterFrame", this.updateAcceleration);
      this.inMotion = false;
      this.trigger("PatternAborted");
    }
  },

  updateAcceleration({ dt }) {
    this.wayPointEasing.tick(dt);
    const value = this.wayPointEasing.value();
    const p = this.bezierPath.get(value);
    this.attr(p);
    if (value >= 1.0) {
      this.unbind("EnterFrame", this.updateAcceleration);
      this.inMotion = false;
      this.trigger("PatternCompleted");
    }
  }
});
