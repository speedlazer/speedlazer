import { flipRotation } from "../lib/rotation";
import Composable from "./Composable";
import Weapon from "./Weapon";
import ParticleEmitter from "./ParticleEmitter";
import { compositions, entities, particles, weapons } from "../data";
import merge from "lodash/merge";
import audio from "../lib/audio";
import Crafty from "../crafty";

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
    .attr({ x: 0, y: 0 })
    .applyDefinition(entityName)
    .attr({ ...convertLocation(location), ...settings });
};

export const EntityDefinition = "EntityDefinition";

const setEntityStructure = (root, entity, state, duration) => {
  const tasks = [];

  if (state.composition) {
    const composition = compositions(state.composition);
    entity.addComponent(Composable).compose(composition);
    if (!state.frame) {
      if (entity.getAnimation("default")) {
        tasks.push(entity.playAnimation("default"));
      } else {
        tasks.push(entity.displayFrame("default", duration));
      }
    }
    if (!state.animation) {
      entity.stopAnimation();
    }
  }
  if (state.animation !== undefined && entity.has(Composable)) {
    tasks.push(
      state.animation
        ? entity.playAnimation(state.animation)
        : entity.stopAnimation()
    );
  }
  if (state.frame && entity.has(Composable)) {
    const [frame, settings] =
      typeof state.frame === "string"
        ? [state.frame, { duration }]
        : state.frame;
    tasks.push(
      entity.displayFrame(frame, settings.duration || duration, settings.easing)
    );
  }
  if (state.audio) {
    audio.playAudio(state.audio);
  }
  if (state.entity) {
    entity.addComponent(EntityDefinition).applyDefinition(state.entity);
  }
  if (state.state) {
    tasks.push(entity.showState(state.state, duration));
  }
  if (state.particles) {
    if (state.particles.emitter) {
      const particleEmitter = state.particles.emitter;
      if (Array.isArray(particleEmitter)) {
        const emitter = merge(
          {},
          particles(particleEmitter[0]),
          particleEmitter[1]
        );
        if (!entity.emitter) {
          console.log(emitter);
          const e = Crafty.e(ParticleEmitter).particles(emitter, entity);
          entity.attr({ w: emitter.emitter.w, h: emitter.emitter.h });
          entity.emitter = e;
          entity.emitting = particleEmitter[0];
        } else {
          entity.emitter.particles(emitter, entity);
        }
      } else {
        const emitter = particles(particleEmitter);
        if (!entity.emitter) {
          const e = Crafty.e(ParticleEmitter).particles(emitter, entity);
          entity.attr({ w: emitter.emitter.w, h: emitter.emitter.h });
          entity.emitter = e;
          entity.emitting = particleEmitter;
        } else {
          entity.emitter.particles(emitter, entity);
        }
      }
      if (!!root.xFlipped !== !!entity.emitter.xFlipped) {
        const angle = entity.angle || 0;
        const delta = angle - entity.emitter.particleSettings.currentAngle;
        entity.emitter.xFlipped = !entity.emitter.xFlipped;
        entity.angle =
          flipRotation(entity.emitter.particleSettings.currentAngle) + delta;
        entity.trigger("Change", { angle: entity.angle });
      }
    }
    if (state.particles.active === true) entity.emitter.startEmission();
    if (state.particles.active === false) entity.emitter.stopEmission();
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
  if (state.removeComponents) {
    state.removeComponents.forEach(comp => entity.removeComponent(comp));
  }
  if (state.weapon) {
    if (state.weapon.pattern) {
      const pattern = weapons(state.weapon.pattern);
      if (
        !entity.has(Weapon) ||
        (entity.definition && entity.definition.pattern !== pattern)
      ) {
        if (state.weapon.barrel) {
          const barrel = root.getElementByKey(state.weapon.barrel);
          entity.barrel = barrel;
        } else {
          entity.barrel = null;
        }
        entity
          .attr({ difficulty: 0, mainEntity: root })
          .addComponent(Weapon)
          .weapon({ ...state.weapon, pattern });
      }
    }
    tasks.push(
      state.weapon.active
        ? entity.activate(state.weapon.maxBursts)
        : entity.deactivate()
    );
  }

  if (state.attachments && typeof entity.attachEntity === "function") {
    Object.entries(state.attachments).forEach(
      ([attachPoint, attachDefinition]) => {
        if (attachDefinition) {
          const itemName = attachDefinition.name || attachPoint;
          const attachment =
            entity[itemName] ||
            Crafty.e("2D").attr({ w: 1, h: 1, sourceEntity: root });

          tasks.push(
            setEntityStructure(root, attachment, attachDefinition, duration)
          );
          entity.attachEntity(attachPoint, attachment);

          entity[itemName] = attachment;
        } else {
          entity.clearAttachment(attachPoint);
          entity[attachPoint] = null;
        }
      }
    );
  }
  return Promise.all(tasks);
};

Crafty.c(EntityDefinition, {
  init() {
    this.appliedEntityDefinition = null;
    this.appliedEntityName = null;
    this.appliedEntityState = "default";
    this.showState = this.showState.bind(this);
  },

  applyDefinition(entityName) {
    const definition = entities(entityName);
    this.addComponent(entityName);
    const structure = definition.structure;
    setEntityStructure(this, this, structure, 0);

    this.appliedEntityDefinition = definition;
    this.appliedEntityName = entityName;
    return this;
  },

  showState(stateName, duration = 0) {
    const stateDefinition =
      stateName === "default"
        ? this.appliedEntityDefinition.structure
        : this.appliedEntityDefinition.states[stateName];
    if (!stateDefinition) return;
    this.appliedEntityState = stateName;
    return setEntityStructure(this, this, stateDefinition, duration);
  }
});
