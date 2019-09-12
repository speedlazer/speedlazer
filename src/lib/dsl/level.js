import { setScenery, setScrollVelocity } from "src/components/Scenery";

const levelFunctions = () => ({
  setScrollingSpeed: async (x, y) => {
    setScrollVelocity({ vx: -x, vy: y });
    //const applySettings = {
    //accellerate: true,
    //x: 0,
    //y: 0,
    //...settings
    //};
    // TODO: Refactor setForcedSpeed internally
    //level.setForcedSpeed(applySettings, applySettings);
  },
  setScenery: async sceneryName => {
    setScenery(sceneryName);
  }
});

export default levelFunctions;
