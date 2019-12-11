import { setScenery, setScrollVelocity } from "src/components/Scenery";
import backgrounds from "src/data/backgrounds";
import {
  setBackground,
  setBackgroundCheckpoint,
  setBackgroundCheckpointLimit
} from "src/components/Background";

const levelFunctions = () => ({
  setScrollingSpeed: async (x, y) => {
    setScrollVelocity({ vx: -x, vy: y });
  },
  setScenery: async sceneryName => {
    setScenery(sceneryName);
  },
  setBackground: async backgroundName => {
    setBackground(backgrounds[backgroundName]);
  },
  setBackgroundCheckpointLimit: async limit => {
    setBackgroundCheckpointLimit(limit);
  },
  setBackgroundCheckpoint: async checkpoint => {
    setBackgroundCheckpoint(checkpoint);
  }
});

export default levelFunctions;
