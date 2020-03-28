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
import { playAnimation } from "src/components/Animation";
import { EASE_IN_OUT } from "src/constants/easing";

const levelFunctions = () => ({
  setScrollingSpeed: async (x, y) => {
    setScrollVelocity({ vx: -x, vy: y });
  },
  setAltitude: async y =>
    new Promise(resolve => {
      const altPSec = 50 / 1000;
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
