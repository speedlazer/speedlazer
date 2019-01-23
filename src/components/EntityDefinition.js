import "src/components/Composable";
import entities from "src/data/entities";
import compositions from "src/data/compositions";

const convertLocation = location => {
  if (!location) return {};
  let x = location.x;
  let y = location.y;
  if (location.rx) x = Crafty.viewport.width * location.rx;
  if (location.ry) y = Crafty.viewport.height * location.ry;

  return { x, y };
};

export const createEntity = (entityName, options = {}) => {
  const { location, ...settings } = options;
  return Crafty.e("2D, WebGL, EntityDefinition")
    .attr({ x: 0, y: 0, w: 40, h: 40 })
    .applyDefinition(entityName)
    .attr({ ...convertLocation(location), ...settings });
};

const setEntityStructure = (entity, state) => {
  if (state.composition) {
    const composition = compositions[state.composition];
    entity.addComponent("Composable").compose(composition);
  }
  if (state.entity) {
    entity.addComponent("EntityDefinition").applyDefinition(state.entity);
  }

  if (state.components) {
    state.components.forEach(compDefinition => {
      if (typeof compDefinition === "string") {
        entity.addComponent(compDefinition);
      } else {
        const [compName, config] = compDefinition;
        entity.addComponent(compName).attr(config);
      }
    });
  }

  if (state.attachments && typeof entity.attachEntity === "function") {
    Object.entries(state.attachments).forEach(
      ([attachPoint, attachDefinition]) => {
        const attachment = Crafty.e("2D, WebGL");
        setEntityStructure(attachment, attachDefinition);
        entity.attachEntity(attachPoint, attachment);
        const itemName = attachDefinition.name || attachPoint;
        entity[itemName] = attachment;
      }
    );
  }
};

Crafty.c("EntityDefinition", {
  init() {
    this.appliedEntityDefinition = null;
  },

  applyDefinition(entityName) {
    const definition = entities.find(e => e.name === entityName);
    this.addComponent(entityName);
    const structure = definition.structure;
    setEntityStructure(this, structure);

    this.appliedEntityDefinition = definition;
    return this;
  },

  showState(stateName) {
    const stateDefinition = this.appliedEntityDefinition.states[stateName];
    // make sure 'default' will be a 'reset'
    if (!stateDefinition) return;
    setEntityStructure(this, stateDefinition);
    //console.log("Show state", stateName, stateDefinition);
  }
});
