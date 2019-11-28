import particleVertexShader from "./shaders/particle.vert";
import particleFragmentShader from "./shaders/particle.frag";
import WebGLParticles from "src/components/WebGLParticles";

const randM1to1 = () => Math.random() * 2 - 1;

const spawnParticle = (entity, settings) => {
  const x = entity.x + Math.random() * entity.w;
  const y = entity.y + Math.random() * entity.h;
  const speed = 80 + randM1to1() * 10;
  const angle = 0 + randM1to1() * 360;
  const life = 1000 + randM1to1() * 500;

  return {
    aPosition: [x, y],
    aVelocity: [speed, (angle * Math.PI) / 180],
    aOrientation: [x, y, 0],
    aSize: [8, 24],
    aLife: [entity.timeFrame, life],
    expire: entity.timeFrame + life,
    aLayer: [entity._globalZ, entity._alpha],
    aColor1: [1, 1, 0, 1],
    aColor2: [0.2, 0.2, 0.2, 1]
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
      const gl = e.program.context;
      gl.uniform4f(e.program.shader.time, entity.timeFrame, 0, 0, 0);
    }
  )
);

const ParticleEmitter = "ParticleEmitter";

Crafty.c(ParticleEmitter, {
  required: `2D, ${WebGLParticles}`,
  _red: 0,
  _green: 0,
  _blue: 0,
  _strength: 1.0,
  ready: true,

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
    }
  },

  _drawParticles: function(e) {
    // The expensive draw
    if (this.initialDraw === false) {
      console.log("EXPENSIVE!");
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

  particles: function() {
    const amount = 800;

    this.particles = Array(amount)
      .fill(0)
      .map(() => spawnParticle(this));

    this.nextExpireCheck = this.particles.reduce(
      (acc, p) => (acc > p.expire ? p.expire : acc),
      Infinity
    );

    this.trigger("Invalidate");
    return this;
  },

  _renderParticles({ dt }) {
    this.timeFrame += dt;

    if (this.timeFrame >= this.nextExpireCheck) {
      this.nextExpireCheck = this.timeFrame + 200;
      for (let i = 0; i < this.particles.length; i++) {
        if (this.particles[i].expire < this.timeFrame) {
          this.particles[i] = spawnParticle(this);
          this._writeParticle(i, this.particles[i]);
        }
      }
    }
  }
});

/*
var pos = this.drawVars.pos;
pos._x = this._x;
pos._y = this._y;
pos._w = this._w;
pos._h = this._h;

var coord = this.__coord || [0, 0, 0, 0];
var co = this.drawVars.co;
co.x = coord[0];
co.y = coord[1];
co.w = coord[2];
co.h = coord[3];

// Handle flipX, flipY
// (Just swap the positions of e.g. x and x+w)
if (this._flipX) {
    co.x = co.x + co.w;
    co.w = -co.w;
}
if (this._flipY) {
    co.y = co.y + co.h;
    co.h = -co.h;
}

//Draw entity
var gl = this._drawContext;
this.drawVars.gl = gl;
var prog = (this.drawVars.program = this.program);

// The program might need to refer to the current element's index
prog.setCurrentEntity(this);

// Write position; x, y, w, h
prog.writeVector(
    "aPosition",
    this._x,
    this._y,
    this._x,
    this._y + this._h,
    this._x + this._w,
    this._y,
    this._x + this._w,
    this._y + this._h
);

// Write orientation
prog.writeVector(
    "aOrientation",
    this._origin.x + this._x,
    this._origin.y + this._y,
    (this._rotation * Math.PI) / 180
);

// Write z, alpha
prog.writeVector("aLayer", this._globalZ, this._alpha);

// This should only need to handle *specific* attributes!
this.trigger("Draw", this.drawVars);

// Register the vertex groups to be drawn, referring to this entities position in the big buffer
prog.addIndices(prog.ent_offset);
*/

export default ParticleEmitter;
