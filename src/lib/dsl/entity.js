import { createEntity } from "src/components/EntityDefinition";

const entityFunctions = () => ({
  spawn: (entityName, settings) => createEntity(entityName, settings)
});

export default entityFunctions;
