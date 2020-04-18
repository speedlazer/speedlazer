import { getBezierPath } from "src/lib/BezierPath";
import StackableCoordinates from "./StackableCoordinates";

const WayPointMotion = "WayPointMotion";

const executeEvent = (event, entity) => {
  const eventData = event.event;
  if (eventData.setState && entity.showState) {
    entity.showState(eventData.setState[0], eventData.setState[1]);
  }
  if (eventData.event) {
    entity.trigger(eventData.event);
  }
};

Crafty.c(WayPointMotion, {
  required: StackableCoordinates,

  init() {
    this.createStackablePropertyFor("xPath", "x");
    this.createStackablePropertyFor("yPath", "y");
  },

  remove() {
    this.stopFlyPattern();
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
    this.eventQueue = pattern.reduce((acc, item, index) => {
      if (item.events === undefined) return acc;
      const part = this.bezierPath.curves[index];
      return acc.concat(
        item.events.map(([t, data]) => ({
          pos: part.min + (part.length * t) / this.bezierPath.length,
          event: data
        }))
      );
    }, []);

    const duration = d || (this.bezierPath.length / velocity) * 1000;

    const fullDuration = duration / (end - start);

    this.wayPointEasing = new Crafty.easing(fullDuration, easing);
    this.wayPointEasing.tick(start * fullDuration);
    this.targetPatternValue = end;

    const value = this.wayPointEasing.value();
    this.pathOffset = this.bezierPath.get(value);

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
    this.eventQueue = this.eventQueue.filter(e => {
      if (e.pos <= value) {
        // execute Event
        executeEvent(e, this);
        return false;
      }
      return true;
    });

    const p = this.bezierPath.get(value);
    if (p) {
      this.attr({
        xPath: p.x - this.pathOffset.x,
        yPath: p.y - this.pathOffset.y
      });
    }
    if (value >= this.targetPatternValue || !p) {
      this.unbind("EnterFrame", this.updateAcceleration);
      // apply final path coordinates after route is finished
      this.applyStackableProperty("xPath", "x");
      this.applyStackableProperty("yPath", "y");
      this.inMotion = false;
      this.trigger("PatternCompleted", { patternCompleted: true });
    }
  }
});

export default WayPointMotion;
