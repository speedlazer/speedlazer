import spritesheets from "src/data/spritesheets";

const dataFunctions = () => ({
  loadSpriteSheets: async sheetNames =>
    new Promise(resolve => {
      const loader = {
        sprites: {}
      };
      spritesheets
        .filter(sheet => sheetNames.includes(sheet.name))
        .forEach(sheet => {
          loader.sprites[sheet.image] = sheet.map;
        });
      Crafty.load(loader, resolve);
    })
});

const flowFunctions = () => ({
  call: async (fn, ...args) => await fn(...args)
});

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

const shipFunctions = (state, level) => ({
  setWeapons: async weapons => {
    Crafty("PlayerControlledShip").each(function() {
      this.clearItems();
      weapons.forEach(weapon => {
        this.installItem(level.inventory(weapon));
      });
    });
    level.setStartWeapons(weapons);
  }
});

export const createScriptExecutionSpace = level => {
  // determine script 'seed' to stop execution
  const state = {
    running: true
  };

  const dsl = {
    ...dataFunctions(),
    ...flowFunctions(),
    ...levelFunctions(state, level),
    ...shipFunctions(state, level)
  };
  return dsl;
};
