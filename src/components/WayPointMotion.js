import { getBezierPath } from "src/lib/BezierPath";
import StackableCoordinates from "./StackableCoordinates";

const WayPointMotion = "WayPointMotion";

Crafty.c(WayPointMotion, {
  required: StackableCoordinates,

  init() {
    this.createStackablePropertyFor("xPath", "x");
    this.createStackablePropertyFor("yPath", "y");
  },

  flyPattern(
    pattern,
    { duration: d, velocity, easing = "linear", start = 0.0, end = 1.0 } = {}
  ) {
    this.pattern = pattern;

    const vpw = Crafty.viewport.width;
    const vph = Crafty.viewport.height;
    const base = this.pattern[0];
    const normalizedPath = pattern.map(({ x, y }) => ({
      x: (x - base.x) * vpw,
      y: (y - base.y) * vph
    }));
    this.bezierPath = getBezierPath(normalizedPath);

    const duration = d || (this.bezierPath.length / velocity) * 1000;

    const fullDuration = duration / (end - start);

    this.wayPointEasing = new Crafty.easing(fullDuration, easing);
    this.wayPointEasing.tick(start * fullDuration);
    this.targetPatternValue = end;

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

    this.attr({ xPath: p.x, yPath: p.y });
    if (value >= this.targetPatternValue) {
      this.unbind("EnterFrame", this.updateAcceleration);
      this.inMotion = false;
      this.trigger("PatternCompleted");
    }
  }
});

export default WayPointMotion;
