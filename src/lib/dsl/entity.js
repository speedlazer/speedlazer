import { LINEAR } from "src/constants/easing";
import { createEntity } from "src/components/EntityDefinition";
import flyPatterns from "src/data/fly-patterns";
import "src/components/WayPointMotion";

const entityFunctions = () => ({
  spawn: (entityName, settings) => createEntity(entityName, settings),
  displayFrame: async (entity, frameName, duration, easing = LINEAR) => {
    await entity.displayFrame(frameName, duration, easing);
  },
  moveWithPattern: (entity, pattern, velocity = null, easing = LINEAR) => {
    const flyPattern = flyPatterns[pattern];
    entity.addComponent("WayPointMotion");
    const v = velocity || entity.defaultVelocity;
    entity.flyPattern(flyPattern, v, easing);

    return {
      process: new Promise(resolve => {
        const complete = () => {
          entity.unbind("PatternCompleted", complete);
          entity.unbind("PatternAborted", complete);
          resolve();
        };
        entity.one("PatternCompleted", complete);
        entity.one("PatternAborted", complete);
      }),
      abort: () => entity.stopFlyPattern()
    };
  }
});

export default entityFunctions;
