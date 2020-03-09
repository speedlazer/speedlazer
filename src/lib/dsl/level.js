import { setScenery, setScrollVelocity } from "src/components/Scenery";
import animations from "src/data/animations";
import {
  setBackground,
  setBackgroundCheckpoint,
  setBackgroundCheckpointLimit
} from "src/components/Background";
import { playAnimation } from "src/components/Animation";

const levelFunctions = () => ({
  setScrollingSpeed: async (x, y) => {
    setScrollVelocity({ vx: -x, vy: y });
  },
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
    playAnimation(animations[animation], options),
  loseLife: () => {
    console.log("losing a life!");
  }
});

export default levelFunctions;
