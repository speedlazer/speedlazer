import { setScenery, setScrollVelocity } from "src/components/Scenery";

const levelFunctions = () => ({
  setScrollingSpeed: async (x, y) => {
    setScrollVelocity({ vx: -x, vy: y });
  },
  setScenery: async sceneryName => {
    setScenery(sceneryName);
  }
});

export default levelFunctions;
