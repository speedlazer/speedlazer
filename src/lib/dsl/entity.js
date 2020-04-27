import { LINEAR } from "src/constants/easing";
import { createEntity } from "src/components/EntityDefinition";
import { paths } from "data";
import "src/components/WayPointMotion";

const move = (entity, flyPattern, velocity, easing, state) => {
  entity.addComponent("WayPointMotion");
  const v = velocity || entity.defaultVelocity;
  entity.flyPattern(flyPattern, { velocity: v, easing });
  let completed = null;

  return {
    wasCompleted: () => completed,
    process: new Promise((resolve, reject) => {
      const complete = eventData => {
        completed = eventData && eventData.patternCompleted;
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
};

const entityFunctions = (_, state) => ({
  spawn: (entityName, settings) => createEntity(entityName, settings),
  displayFrame: async (entity, frameName, duration, easing = LINEAR) => {
    await entity.displayFrame(frameName, duration, easing);
  },
  showState: async (entity, state, duration, easing = LINEAR) => {
    await entity.showState(state, duration, easing);
  },
  showAnimation: async (entity, animation) => {
    await entity.playAnimation(animation);
  },
  allowDamage: (entity, settings) => {
    entity.addCollisionComponent("DamageSupport", ["processDamage"]);
    entity.allowDamage(settings);
  },
  moveWithPattern: (entity, pattern, velocity = null, easing = LINEAR) => {
    const flyPattern = paths(pattern);
    return move(entity, flyPattern, velocity, easing, state);
  },
  moveTo: (entity, coord, velocity = null, easing = LINEAR) => {
    const vpw = Crafty.viewport.width;
    const vph = Crafty.viewport.height;
    const startX = entity.x / vpw;
    const startY = entity.y / vph;

    const flyPattern = [
      { x: startX, y: startY },
      {
        x: startX,
        y: startY,
        ...coord
      }
    ];
    return move(entity, flyPattern, velocity, easing, state);
  }
});

export default entityFunctions;
