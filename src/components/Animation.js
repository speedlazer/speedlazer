import Composable from "./Composable";
import compositions from "src/data/compositions";
import { createEntity } from "src/components/EntityDefinition";
import paths from "src/data/paths";
import WayPointMotion from "./WayPointMotion";
import { LINEAR } from "src/constants/easing";
import { getBackgroundColor, setBackgroundColor } from "src/components/Horizon";
import { mix, strToColor } from "src/components/generic/ColorFade";

export const Animation = "Animation";

Crafty.c(Animation, {
  init() {
    this.elements = {};
  },

  setAnimation(animation, { maxCheckpoint = 0, ...options } = {}) {
    this.currentBackground = animation;

    this.maxAllowedCheckpoint = maxCheckpoint;
    this.setActiveCheckpoint(0, options);
  },

  setCheckpointLimit(limit) {
    this.maxAllowedCheckpoint = limit;
    if (this.targetCheckpoint < limit && !this.animatingBackground) {
      this.setActiveCheckpoint(this.targetCheckpoint + 1);
    }
  },

  setActiveCheckpoint(checkpoint, { autoStart = true, duration = null } = {}) {
    this.unbind("EnterFrame", this.updateAnimation);
    const checkpointData = this.currentBackground.checkpoints[checkpoint];
    if (!checkpointData) return;
    this.animatingBackground = true;
    this.targetCheckpoint = checkpoint;

    let toRemove = Object.keys(this.elements);
    (checkpointData.composables || []).forEach(([composable, settings]) => {
      const composition = compositions[composable];

      const existing = this.elements[settings.key];
      toRemove = toRemove.filter(k => k !== settings.key);
      if (existing && existing.appliedDefinition === composition) {
        const startFrame = settings.frame || "default";
        if (existing.targetFrame !== startFrame) {
          existing.displayFrame(startFrame);
        }
      } else {
        existing && existing.destroy();
        const x = (settings.relativeX || 0) * Crafty.viewport.width;
        const y = (settings.relativeY || 0) * Crafty.viewport.height;

        const sub = Crafty.e(["2D", "WebGL", Composable].join(","))
          .attr({ x, y, w: 40, h: 40, z: this.z })
          .compose(composition);
        //this.attach(sub);
        sub.displayFrame(settings.frame || "default");
        this.elements[settings.key] = sub;
      }
    });
    (checkpointData.entities || []).forEach(([entity, settings]) => {
      const existing = this.elements[settings.key];
      toRemove = toRemove.filter(k => k !== settings.key);
      if (!existing) {
        const x = (settings.relativeX || 0) * Crafty.viewport.width;
        const y = (settings.relativeY || 0) * Crafty.viewport.height;
        const e = createEntity(entity, settings).attr({ x, y, z: this.z });
        this.elements[settings.key] = e;
        e.showState(settings.state || "default");
      } else {
        settings.relativeX &&
          existing.attr({ x: settings.relativeX * Crafty.viewport.width });
        settings.relativeY &&
          existing.attr({ y: settings.relativeY * Crafty.viewport.height });
        existing.attr({ z: this.z });
        existing.showState(settings.state || "default");
      }
    });
    toRemove.forEach(k => {
      this.elements[k].destroy();
      delete this.elements[k];
    });

    if (autoStart && checkpointData.timeline) {
      this.animationDuration =
        duration || checkpointData.timeline.defaultDuration;
      if (checkpointData.backgroundColor) {
        const backgroundColor = strToColor([
          checkpointData.backgroundColor,
          1.0
        ]);
        setBackgroundColor(backgroundColor);
      }
      if (this.animationDuration) {
        this.animationTimer = new Crafty.easing(this.animationDuration, LINEAR);
        this.timeLineEvents = checkpointData.timeline.transitions.map(t => ({
          ...t,
          handled: false
        }));

        this.uniqueBind("EnterFrame", this.updateAnimation);
      }
    }
  },

  updateAnimation({ dt }) {
    this.animationTimer.tick(dt);
    const value = this.animationTimer.value();
    this.timeLineEvents.forEach(t => {
      if (t.handled || t.start > value) return;
      // handle event
      if (t.targetFrame && t.key) {
        const elem = this.elements[t.key];
        t.handled = true;
        elem &&
          elem.displayFrame(
            t.targetFrame,
            (t.end - t.start) * this.animationDuration
          );
      }
      if (t.targetState && t.key) {
        const elem = this.elements[t.key];
        t.handled = true;
        elem &&
          elem.showState(
            t.targetState,
            (t.end - t.start) * this.animationDuration
          );
      }
      if (t.targetBackgroundColor) {
        if (t.sourceColor && t.ease) {
          t.ease.tick(dt);
          const color = mix(t.ease.value(), t.sourceColor, t.targetColor);
          setBackgroundColor(color);
          if (t.ease.value() >= 1.0) {
            t.handled = true;
          }
        } else {
          t.sourceColor = getBackgroundColor();
          t.targetColor = strToColor([t.targetBackgroundColor, 1.0]);
          t.ease = new Crafty.easing(
            (t.end - t.start) * this.animationDuration,
            LINEAR
          );
          t.ease.tick(dt);
          const color = mix(t.ease.value(), t.sourceColor, t.targetColor);
          setBackgroundColor(color);
        }
      }
      if (t.path && t.key) {
        t.handled = true;
        const elem = this.elements[t.key];
        if (!elem) return;
        elem.addComponent(WayPointMotion);
        const pathDuration = (t.end - t.start) * this.animationDuration;

        const path = t.path.data || paths[t.path.name];

        elem.flyPattern(path, {
          duration: pathDuration,
          start: t.path.start || 0.0,
          end: t.path.end || 1.0
        });
      }
    });

    if (value >= 1.0) {
      this.unbind("EnterFrame", this.updateAnimation);
      this.animatingBackground = false;
      if (
        this.maxAllowedCheckpoint > this.targetCheckpoint &&
        this.currentBackground.checkpoints.length > this.targetCheckpoint + 1
      ) {
        this.setActiveCheckpoint(this.targetCheckpoint + 1);
      }
    }
  }
});

export default Animation;
