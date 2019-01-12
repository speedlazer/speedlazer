import "src/components/Composable";
import entities from "src/data/entities";
import compositions from "src/data/compositions";

const getEntityState = (definition, state) => {
  const targetState = definition.states[state];
  // TODO: handle 'extends' key

  const stateDefinition = {
    ...targetState
  };

  return stateDefinition;
};

export const createEntity = entityName =>
  Crafty.e("2D, WebGL, EntityDefinition")
    .attr({ x: 0, y: 0, w: 40, h: 40 })
    .applyDefinition(entityName);

const setEntityState = (entity, state) => {
  if (state.composition) {
    const composition = compositions[state.composition];
    entity.addComponent("Composable").compose(composition);
  }
  if (state.entity) {
    console.log("Entity base:", state.entity);
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
        setEntityState(attachment, attachDefinition);
        entity.attachEntity(attachPoint, attachment);
        const itemName = attachDefinition.name || attachPoint;
        entity[itemName] = attachment;
      }
    );
  }
};

Crafty.c("EntityDefinition", {
  init() {
    this.appliedDefinition = null;
    this.currentState = null;
  },

  applyDefinition(entityName) {
    const definition = entities.find(e => e.name === entityName);
    this.addComponent(entityName);
    const defaultState = getEntityState(definition, "default");
    setEntityState(this, defaultState);

    console.log(this.__c);

    this.appliedDefinition = definition;
    return this;
  }
});
