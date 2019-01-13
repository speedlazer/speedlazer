const levelFunctions = (state, level) => ({
  setScrollingSpeed: async settings => {
    const applySettings = {
      accellerate: true,
      x: 0,
      y: 0,
      ...settings
    };
    // TODO: Refactor setForcedSpeed internally
    level.setForcedSpeed(applySettings, applySettings);
  },
  setScenery: async sceneryName => {
    level.setScenery(sceneryName);
  }
});

export default levelFunctions;
