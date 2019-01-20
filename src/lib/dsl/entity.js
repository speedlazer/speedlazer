import { LINEAR } from "src/constants/easing";
import { createEntity } from "src/components/EntityDefinition";

const entityFunctions = () => ({
  spawn: (entityName, settings) => createEntity(entityName, settings),
  displayFrame: async (entity, frameName, duration, easing = LINEAR) => {
    await entity.displayFrame(frameName, duration, easing);
  }
});

export default entityFunctions;
