import { Noise } from "noisejs";
import {
  setScenery,
  setScrollVelocity,
  setAltitude,
  getAltitude
} from "src/components/Scenery";
import animations from "src/data/animations";
import {
  setBackground,
  setBackgroundCheckpoint,
  setBackgroundCheckpointLimit
} from "src/components/Background";
import { lookup } from "src/lib/random";
import { playAnimation } from "src/components/Animation";
import { EASE_IN_OUT } from "src/constants/easing";

const noise = new Noise(lookup());
const MAX_X_OFFSET = 30;
const MAX_Y_OFFSET = 15;

const levelFunctions = state => ({
  trauma: { value: 0, time: 0, handler: null },

  addScreenTrauma: value => {
    state.trauma.value += value;

    if (state.trauma.value > 0 && state.trauma.handler === null) {
      state.trauma.handler = ({ dt }) => {
        const screenshake = state.trauma.value * state.trauma.value;

        state.trauma.value = Math.max(0, state.trauma.value - 0.001 * dt);
        let x = 0;
        let y = 0;
        if (screenshake > 0) {
          state.trauma.time += dt;

          const xn = noise.perlin2(
            0.1,
            state.trauma.time / ((3 - state.trauma.value) * 360)
          );
          const yn = noise.perlin2(
            state.trauma.time / ((3 - state.trauma.value) * 360),
            0.3
          );
          x = 0 + Math.round(MAX_X_OFFSET * screenshake * xn);
          y = 0 + Math.round(MAX_Y_OFFSET * screenshake * yn);
        }

        Crafty.viewport.x = x;
        Crafty.viewport.y = y;

        if (screenshake === 0) {
          Crafty.unbind("EnterFrame", state.trauma.handler);
          state.trauma.handler = null;
        }
      };

      Crafty.bind("EnterFrame", state.trauma.handler);
    }
  },
  setScrollingSpeed: async (x, y) => {
    setScrollVelocity({ vx: -x, vy: y });
  },
  setAltitude: async (y, { speed = 50, instant = false } = {}) =>
    instant
      ? setAltitude(y)
      : new Promise(resolve => {
          const altPSec = speed / 1000;
          const startAlt = getAltitude();
          const delta = Math.abs(y - startAlt);

          const ease = new Crafty.easing(delta / altPSec, EASE_IN_OUT);
          const f = ({ dt }) => {
            ease.tick(dt);
            const v = ease.value();
            if (v >= 1.0) {
              Crafty.unbind("EnterFrame", f);
              resolve();
            }
            const alt = startAlt * (1 - v) + y * v;
            setAltitude(alt);
          };

          Crafty.bind("EnterFrame", f);
        }),
  setScenery: async sceneryName => {
    setScenery(sceneryName);
  },
  setBackground: async backgroundName => {
    setBackground(animations[backgroundName]);
  },
  setBackgroundCheckpointLimit: async limit => {
    setBackgroundCheckpointLimit(limit);
  },
  setBackgroundCheckpoint: async checkpoint => {
    setBackgroundCheckpoint(checkpoint);
  },
  playAnimation: (animation, options) =>
    playAnimation(animations[animation], options)
});

export default levelFunctions;
