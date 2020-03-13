import { LINEAR } from "src/constants/easing";
import { createEntity } from "src/components/EntityDefinition";
import paths from "src/data/paths";
import "src/components/WayPointMotion";

const entityFunctions = (_, state) => ({
  spawn: (entityName, settings) => createEntity(entityName, settings),
  displayFrame: async (entity, frameName, duration, easing = LINEAR) => {
    await entity.displayFrame(frameName, duration, easing);
  },
  moveWithPattern: (entity, pattern, velocity = null, easing = LINEAR) => {
    const flyPattern = paths[pattern];
    entity.addComponent("WayPointMotion");
    const v = velocity || entity.defaultVelocity;
    entity.flyPattern(flyPattern, { velocity: v, easing });

    return {
      process: new Promise((resolve, reject) => {
        const complete = () => {
          entity.unbind("PatternCompleted", complete);
          entity.unbind("PatternAborted", complete);
          Crafty.unbind("GameOver", complete);
          if (state.gameEnded === true) reject(new Error("Game Over"));
          resolve();
        };
        entity.one("PatternCompleted", complete);
        entity.one("PatternAborted", complete);
        Crafty.one("GameOver", complete);
      }),
      abort: () => entity.stopFlyPattern()
    };
  }
});

export default entityFunctions;
