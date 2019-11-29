import particleVertexShader from "./shaders/particle.vert";
import particleFragmentShader from "./shaders/particle.frag";
import WebGLParticles from "src/components/WebGLParticles";

const randM1to1 = () => Math.random() * 2 - 1;

const spawnParticle = (entity, settings) => {
  const x = entity.x + Math.random() * entity.w;
  const y = entity.y + Math.random() * entity.h;
  const speed = settings.velocity + randM1to1() * settings.velocityRandom;
  const angle = settings.angle + randM1to1() * settings.angleRandom;
  const life = settings.duration + randM1to1() * settings.durationRandom;
  const startSize = settings.startSize + randM1to1() * settings.startSizeRandom;
  const endSize = settings.endSize + randM1to1() * settings.endSizeRandom;

  const startColor = settings.startColor.map(
    (a, i) => a + randM1to1() * settings.startColorRandom[i]
  );
  const endColor = settings.endColor.map(
    (a, i) => a + randM1to1() * settings.endColorRandom[i]
  );

  return {
    aPosition: [x, y],
    aVelocity: [speed, (angle * Math.PI) / 180],
    aOrientation: [x, y, 0],
    aSize: [startSize, endSize],
    aLife: [entity.timeFrame, life],
    expire: entity.timeFrame + life,
    aLayer: [entity._globalZ, entity._alpha],
    aColor1: startColor,
    aColor2: endColor
  };
};

Crafty.defaultShader(
  "Particle",
  new Crafty.WebGLShader(
    particleVertexShader,
    particleFragmentShader,
    [
      { name: "aPosition", width: 2 },
      { name: "aVelocity", width: 2 },
      { name: "aOrientation", width: 3 },
      { name: "aLayer", width: 2 },
      { name: "aSize", width: 2 },
      { name: "aLife", width: 2 },
      { name: "aColor1", width: 4 },
      { name: "aColor2", width: 4 }
    ],
    function(e, entity) {
      e.program.index_pointer = entity.particles.length;

      const gx = entity.particleSettings.gravity[0];
      const gy = entity.particleSettings.gravity[1];
      const gl = e.program.context;
      gl.uniform4f(e.program.shader.time, entity.timeFrame, gx, gy, 0);
    }
  )
);

const ParticleEmitter = "ParticleEmitter";

Crafty.c(ParticleEmitter, {
  required: `2D, ${WebGLParticles}`,
  ready: true,
  __image: "",
  img: null,

  init: function() {
    // Necessary for some rendering layers
    //this.__coord = this.__coord || [0, 0, 0, 0];
    this.bind("Draw", this._drawParticles);
    if (this._drawLayer) {
      this._setupParticles(this._drawLayer);
    }
    this.initialDraw = false;
    this.trigger("Invalidate");
    this.timeFrame = 0;
  },

  events: {
    LayerAttached: "_setupParticles",
    EnterFrame: "_renderParticles"
  },

  remove: function() {
    this.unbind("Draw", this._drawParticles);
    this.trigger("Invalidate");
  },

  _setupParticles: function(layer) {
    if (layer.type === "WebGL") {
      this._establishShader("Particle", Crafty.defaultShader("Particle"));
      if (this.__image !== "") {
        this.program.setTexture(
          layer.makeTexture(this.__image, this.img, false)
        );
      }
    }
  },

  _drawParticles: function(e) {
    // The expensive draw
    if (this.initialDraw === false) {
      e.program.growArrays(this.particles.length);

      for (let pi = 0; pi < this.particles.length; pi++) {
        this._writeParticle(pi, this.particles[pi]);
      }
      this.initialDraw = true;
    }

    e.program.draw(e, this);
  },

  _writeParticle: function(pi, particle) {
    const attributes = this.program.attributes;
    let offset = pi * this.program.stride;

    for (let ai = 0; ai < attributes.length; ai++) {
      for (let api = 0; api < attributes[ai].width; api++) {
        this.program._attributeArray[offset] =
          particle[attributes[ai].name][api];
        offset++;
      }
    }
  },

  particles: function({
    amount = 150,
    gravity = [0, 0],
    velocity = 80,
    velocityRandom = 20,
    angle = 0,
    angleRandom = 360,
    duration = 2000,
    durationRandom = 500,
    startSize = 12,
    startSizeRandom = 2,
    endSize = 24,
    endSizeRandom = 8,
    sprite = null,
    startColor = [1, 1, 1, 1],
    startColorRandom = [0, 0, 0, 0],
    endColor = [0, 0, 0, 1],
    endColorRandom = [0, 0, 0, 0]
  } = {}) {
    this.particleSettings = {
      amount,
      gravity,
      velocity,
      velocityRandom,
      angle,
      angleRandom,
      duration,
      durationRandom,
      startSize,
      startSizeRandom,
      endSize,
      endSizeRandom,
      sprite,
      startColor,
      startColorRandom,
      endColor,
      endColorRandom
    };
    this.emissionRate = amount / duration;
    this.shouldHaveEmitted = 0;

    if (this.particleSettings.sprite) {
      const sprite = Crafty.e(`WebGL, ${this.particleSettings.sprite}`).attr({
        x: 5000,
        y: 5000
      });
      this.__image = sprite.__image;
      this.__coord = sprite.__coord;
      if (this.program) {
        this.program.setTexture(
          this._drawLayer.makeTexture(this.__image, this.img, false)
        );
        const gl = this.program.context;
        gl.uniform4f(
          this.program.shader.spriteCoords,
          this.__coord[0],
          this.__coord[1],
          this.__coord[2],
          this.__coord[3]
        );
      }
      sprite.destroy();
    }

    this.particles = Array(amount)
      .fill(0)
      .map(() =>
        spawnParticle(this, {
          ...this.particleSettings,
          duration: 0,
          durationRandom: 0
        })
      );

    this.nextExpireCheck = 100;

    this.trigger("Invalidate");
    return this;
  },

  _renderParticles({ dt }) {
    this.timeFrame += dt;
    this.shouldHaveEmitted =
      Math.min((this.timeFrame / 1000.0) * this.emissionRate, 1) *
      this.particleSettings.amount;

    if (this.timeFrame >= this.nextExpireCheck) {
      this.nextExpireCheck = this.timeFrame + 100;
      for (let i = 0; i < this.shouldHaveEmitted; i++) {
        if (this.particles[i].expire < this.timeFrame + 50) {
          this.particles[i] = spawnParticle(this, this.particleSettings);
          this._writeParticle(i, this.particles[i]);
        }
      }
    }
  }
});

export default ParticleEmitter;
