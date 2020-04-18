import Composable from "./Composable";
import { compositions, paths } from "data";
import { createEntity } from "src/components/EntityDefinition";
import { tweenFn } from "src/components/generic/TweenPromise";
import WayPointMotion from "./WayPointMotion";
import { LINEAR } from "src/constants/easing";
import { getBackgroundColor, setBackgroundColor } from "src/components/Horizon";
import { mix, strToColor } from "src/components/generic/ColorFade";

export const Animation = "Animation";

Crafty.c(Animation, {
  init() {
    this.elements = {};
  },

  setAnimation(animation, { maxCheckpoint = 0, start = 0, ...options } = {}) {
    if (this.currentAnimation === animation) return;
    this.currentAnimation = animation;

    this.maxAllowedCheckpoint = maxCheckpoint;
    this.setActiveCheckpoint(start, options);
  },

  setCheckpointLimit(limit) {
    const prevLimit = this.maxAllowedCheckpoint;
    this.maxAllowedCheckpoint = limit;
    if (this.targetCheckpoint < limit && !this.playingAnimation) {
      this.setActiveCheckpoint(
        this.targetCheckpoint === prevLimit
          ? this.targetCheckpoint
          : this.targetCheckpoint + 1
      );
    }
  },

  setActiveCheckpoint(checkpoint, { autoStart = true, duration = null } = {}) {
    this.unbind("EnterFrame", this.updateAnimation);
    const checkpointData = this.currentAnimation.checkpoints[checkpoint];
    if (!checkpointData) return;
    this.targetCheckpoint = checkpoint;

    let toRemove = Object.keys(this.elements);
    (checkpointData.composables || []).forEach(([composable, settings]) => {
      const composition = compositions(composable);

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

        const e =
          Crafty(entity).get(0) ||
          createEntity(entity, settings).attr({
            x,
            y,
            z: this.z + (settings.z || 0)
          });
        if (settings.detach && e.detachFromParent) {
          e.detachFromParent();
        }

        this.elements[settings.key] = e;
        if (settings.state) e.showState(settings.state);
      } else {
        existing.attr({ z: this.z });
        if (settings.state) existing.showState(settings.state);
      }
    });
    if (checkpointData.background) {
      setBackgroundColor(checkpointData.background);
    }
    toRemove.forEach(k => {
      delete this.elements[k];
    });
    if (checkpointData.backgroundColor) {
      const backgroundColor = strToColor([checkpointData.backgroundColor, 1.0]);
      setBackgroundColor(backgroundColor);
    }

    if (
      autoStart &&
      checkpointData.timeline &&
      checkpoint < this.maxAllowedCheckpoint
    ) {
      this.playingAnimation = true;
      this.animationDuration =
        duration || checkpointData.timeline.defaultDuration;
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
      if (t.attributes && t.key) {
        const elem = this.elements[t.key];
        t.handled = true;
        if (elem) {
          const tween = tweenFn(elem, t.attributes);
          elem.animate(tween, (t.end - t.start) * this.animationDuration);
        }
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

        const path = t.path.data || paths(t.path.name);

        elem.flyPattern(path, {
          duration: pathDuration,
          start: t.path.start || 0.0,
          end: t.path.end || 1.0,
          easing: t.path.easing || "linear"
        });
      }
      if (t.remove && t.key) {
        t.handled = true;
        const elem = this.elements[t.key];
        if (!elem) return;
        this.elements[t.key].destroy();
        delete this.elements[t.key];
      }
    });

    if (value >= 1.0) {
      this.unbind("EnterFrame", this.updateAnimation);
      this.playingAnimation = false;
      if (
        this.maxAllowedCheckpoint > this.targetCheckpoint &&
        this.currentAnimation.checkpoints.length > this.targetCheckpoint + 1
      ) {
        this.trigger("CheckpointReached", {
          checkpoint: this.targetCheckpoint + 1
        });
        this.setActiveCheckpoint(this.targetCheckpoint + 1);
        // Emit an event that checkpoint is updated
      } else {
        this.trigger("CheckpointReached", {
          checkpoint: this.targetCheckpoint + 1
        });
        this.trigger("AnimationEnded", { checkpoint: this.targetCheckpoint });
      }
    }
  }
});

export default Animation;

export const playAnimation = (
  animation,
  { max = Infinity, start = 0 } = {}
) => {
  const player = Crafty.e(Animation);
  player.setAnimation(animation, { maxCheckpoint: max, start });
  let checkpointReached = null;
  let checkpointSubscriptions = [];
  player.bind("CheckpointReached", ({ checkpoint }) => {
    checkpointReached = checkpoint;
    checkpointSubscriptions = checkpointSubscriptions.filter(
      ({ checkpoint: matchCheckpoint, resolver }) => {
        if (matchCheckpoint == null) {
          resolver({ checkpoint, player });
          return true;
        }
        if (matchCheckpoint <= checkpoint) {
          resolver(checkpoint);
          return false;
        }
        return true;
      }
    );
  });

  return {
    waitTillCheckpoint: checkpoint =>
      checkpoint <= checkpointReached
        ? Promise.resolve()
        : new Promise((resolver, rejecter) => {
            checkpointSubscriptions.push({ checkpoint, resolver, rejecter });
          }),
    onCheckpointChange: callback => {
      checkpointSubscriptions.push({ checkpoint: null, resolver: callback });
    },
    updateCheckpoint: start => {
      player.setActiveCheckpoint(start);
    },
    updateCheckpointLimit: newLimit => {
      player.setCheckpointLimit(newLimit);
    },
    waitTillEnd: () =>
      new Promise(resolve => player.one("AnimationEnded", resolve)),
    destroy: () => {
      checkpointSubscriptions.forEach(
        ({ rejecter }) => rejecter && rejecter(new Error("Animation destroyed"))
      );
      player.destroy();
    }
  };
};
