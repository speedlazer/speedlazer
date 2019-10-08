import Composable from "./Composable";
import compositions from "src/data/compositions";
import { LINEAR } from "src/constants/easing";
import { getBackgroundColor, setBackgroundColor } from "src/components/Horizon";
import { mix, strToColor } from "src/components/generic/ColorFade";

export const Background = "Background";

Crafty.c(Background, {
  required: ["2D, WebGL"].join(","),

  init() {
    this.attr({
      x: 0,
      y: 0,
      w: Crafty.viewport.width / Crafty.viewport._scale,
      h: Crafty.viewport.height / Crafty.viewport._scale,
      z: -10000
    });
    this.bind("ViewportScale", this.updateBackdrop);
    this.elements = {};
  },

  updateBackdrop() {
    this.attr({
      w: Crafty.viewport.width / Crafty.viewport._scale,
      h: Crafty.viewport.height / Crafty.viewport._scale
    });
  },

  setBackground(background, { autoStart = true, duration = null } = {}) {
    let toRemove = Object.keys(this.elements);
    (background.composables || []).forEach(([composable, settings]) => {
      const composition = compositions[composable];

      const existing = this.elements[settings.key];
      toRemove = toRemove.filter(k => k !== settings.key);
      if (existing && existing.appliedDefinition === composition) {
        existing.displayFrame(settings.frame || "default");
      } else {
        existing && existing.destroy();

        const sub = Crafty.e(["2D", "WebGL", Composable].join(","))
          .attr({ x: 0, y: 0, w: 40, h: 40, z: this.z })
          .compose(composition);
        sub.displayFrame(settings.frame || "default");
        this.elements[settings.key] = sub;
      }
    });
    toRemove.forEach(k => {
      this.elements[k].destroy();
      delete this.elements[k];
    });

    if (autoStart && background.timeline) {
      this.animationDuration = duration || background.timeline.defaultDuration;
      if (background.backgroundColor) {
        const backgroundColor = strToColor([background.backgroundColor, 1.0]);
        setBackgroundColor(backgroundColor);
      }
      if (this.animationDuration) {
        this.backgroundTimer = new Crafty.easing(
          this.animationDuration,
          LINEAR
        );
        this.timeLineEvents = background.timeline.transitions.map(t => ({
          ...t,
          handled: false
        }));

        this.uniqueBind("EnterFrame", this.updateBackground);
      }
    }
  },

  updateBackground({ dt }) {
    this.backgroundTimer.tick(dt);
    const value = this.backgroundTimer.value();
    this.timeLineEvents.forEach(t => {
      if (t.handled || t.start > value) return;
      // handle event
      if (t.targetFrame && t.key) {
        const elem = this.elements[t.key];
        t.handled = true;
        elem.displayFrame(
          t.targetFrame,
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
    });

    if (value >= 1.0) {
      this.unbind("EnterFrame", this.updateBackground);
      this.trigger("FadeCompleted");
      console.log("done!");
    }
  }
});

export default Background;

export const setBackground = background => {
  const backdrop = Crafty(Background).get(0) || Crafty.e(Background);
  backdrop.setBackground(background);
};
