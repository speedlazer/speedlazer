import particleVertexShader from "./shaders/particle.vert";
import particleFragmentShader from "./shaders/particle.frag";
import WebGLParticles from "src/components/WebGLParticles";

const randM1to1 = () => Math.random() * 2 - 1;

const spawnParticle = (entity, settings) => {
  const source = entity.attachedTo || entity;
  const x = source.x + Math.random() * entity.w;
  const y = source.y + Math.random() * entity.h;
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

let startRender = null;

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
      const gl = e.program.context;

      if (startRender && !e.program.hasTime) {
        const gx = entity.particleSettings.gravity[0];
        const gy = entity.particleSettings.gravity[1];
        gl.uniform4f(e.program.shader.time, entity.timeFrame, gx, gy, 0);
        e.program.hasTime = entity.timeFrame;
      }

      gl.uniform4f(
        e.program.shader.spriteCoords,
        entity.__coord[0],
        entity.__coord[1],
        entity.__coord[2],
        entity.__coord[3]
      );
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
    this.bind("Draw", this._drawParticles);
    if (this._drawLayer) {
      this._setupParticles(this._drawLayer);
    }
    this.initialDraw = true;
    this.trigger("Invalidate");
    this.timeFrame = 0;
    this.startTime = 0;
  },

  events: {
    LayerAttached: "_setupParticles",
    EnterFrame: "_renderParticles"
  },

  remove() {
    this.initialDraw = true;
    this.unbind("Draw", this._drawParticles);
    this.trigger("Invalidate");
  },

  _setupParticles(layer) {
    if (layer.type === "WebGL") {
      this._establishShader("Particle", Crafty.defaultShader("Particle"));
      if (this.__image !== "") {
        this.program.setTexture(
          layer.makeTexture(this.__image, this.img, false)
        );
      }
    }
  },

  _drawParticles(e) {
    // The expensive draw
    if (this.initialDraw === true) {
      this.particleBuffer.growArrays(this._particles.length);

      for (let pi = 0; pi < this._particles.length; pi++) {
        this._writeParticle(pi, this._particles[pi]);
      }
      this.initialDraw = false;
    }

    e.program.draw(e, this);
  },

  _writeParticle(pi, particle) {
    this.particleBuffer.writeParticle(pi, particle);
  },

  attachToEntity(entity) {
    this.attachedTo = entity;
    this.z = entity.z;
    entity.bind("Reorder", () => {
      this.z = entity.z;
    });
    entity.bind("move", () => {
      this.x = entity.x;
      this.y = entity.y;
    });
    entity.bind("Remove", () => {
      this.stopEmission();
      this.attachedTo = null;
      this.autoDestruct = true;
    });
  },

  particles(
    {
      emitter: {
        amount = 150,
        w = 10,
        h = 10,
        duration: emitterDuration = Infinity
      },
      gravity = [0, 0],
      particle: {
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
      }
    } = {},
    attachTo = null
  ) {
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
      endColorRandom,
      emitterDuration
    };
    if (attachTo) {
      this.attachToEntity(attachTo);
    }

    this.attr({ w, h });
    this.emissionRate = amount / duration;
    this.shouldHaveEmitted = 0;

    if (this.particleSettings.sprite) {
      const sprite = Crafty.e(`WebGL, ${this.particleSettings.sprite}`).attr({
        x: 5000,
        y: 5000
      });
      this.__image = sprite.__image;
      this.__coord = sprite.__coord;
      if (this.program && this._drawLayer) {
        this.program.setTexture(
          this._drawLayer.makeTexture(this.__image, this.img, false)
        );
      }
      sprite.destroy();
    }

    this._particles = Array(amount)
      .fill(0)
      .map(() =>
        spawnParticle(this, {
          ...this.particleSettings,
          duration: 0,
          durationRandom: 0
        })
      );

    this.lastExpired = this._particles.reduce(
      (a, p) => (p.expire > a ? p.expire : a),
      0
    );
    this.nextExpireRatio = duration / amount;
    this.nextExpireCheck = duration / amount;

    this.trigger("Invalidate");
    return this;
  },

  stopEmission() {
    this.emissionRate = 0;
    this.shouldHaveEmitted = 0;
  },

  startEmission() {
    this.emissionRate =
      this.particleSettings.amount / this.particleSettings.duration;
    this.shouldHaveEmitted = 0;
    this.startTime = 0;
  },

  _renderParticles({ dt, gameTime }) {
    startRender = startRender || gameTime;
    this.timeFrame = gameTime - startRender;

    this.startTime += dt;
    this.shouldHaveEmitted =
      Math.min((this.startTime / 1000.0) * this.emissionRate, 1) *
      this.particleSettings.amount;

    if (
      this.timeFrame >= this.nextExpireCheck &&
      this.timeFrame < this.particleSettings.emitterDuration
    ) {
      this.nextExpireCheck = this.timeFrame + this.nextExpireRatio;

      for (let i = 0; i < this.shouldHaveEmitted; i++) {
        if (this._particles[i].expire < this.timeFrame + 20) {
          const p = spawnParticle(this, this.particleSettings);
          if (p.expire > this.lastExpired) {
            this.lastExpired = p.expire;
          }
          this._particles[i] = p;
          this._writeParticle(i, p);
        }
      }
    }
    if (this.autoDestruct && this.timeFrame > this.lastExpired) {
      this.destroy();
    }
  }
});

export default ParticleEmitter;
