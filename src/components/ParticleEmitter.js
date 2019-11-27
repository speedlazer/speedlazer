import particleVertexShader from "./shaders/particle.vert";
import particleFragmentShader from "./shaders/particle.frag";
import WebGLParticles from "src/components/WebGLParticles";

Crafty.defaultShader(
  "Particle",
  new Crafty.WebGLShader(
    particleVertexShader,
    particleFragmentShader,
    [
      { name: "aPosition", width: 2 },
      { name: "aOrientation", width: 3 },
      { name: "aLayer", width: 2 },
      { name: "aColor", width: 4 }
    ],
    function(e, entity) {
      e.program.index_pointer = entity.particles.length;

      //// Write orientation
      //prog.writeVector(
      //"aOrientation",
      //this._origin.x + this._x,
      //this._origin.y + this._y,
      //(this._rotation * Math.PI) / 180
      //);
      //// Write z, alpha
      //prog.writeVector("aLayer", this._globalZ, this._alpha);
      //e.program.writeVector(
      //"aColor",
      //entity._red / 255,
      //entity._green / 255,
      //entity._blue / 255,
      //entity._strength
      //);
      //const positionCoords = new Array(entity.particles.length * 2);
      //for (let i = 0; i < entity.particles.length; i++) {
      //positionCoords[i * 2] = entity.particles[i].x;
      //positionCoords[i * 2 + 1] = entity.particles[i].y;
      //}
      //e.program.writeVector("aPosition", ...positionCoords);
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
    this.trigger("Invalidate");
  },

  events: {
    LayerAttached: "_setupParticles"
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
    const attributes = e.program.attributes;
    let offset = 0;
    for (let pi = 0; pi < this.particles.length; pi++) {
      for (let ai = 0; ai < attributes.length; ai++) {
        for (let api = 0; api < attributes[ai].width; api++) {
          e.program._attributeArray[offset] = this.particles[pi][
            attributes[ai].name
          ][api];

          offset++;
        }
      }
    }

    e.program.draw(e, this);
  },

  particles: function() {
    const particle = (x, y, r, g, b) => ({
      aPosition: [x, y],
      aOrientation: [x, y, 0],
      aLayer: [this._globalZ, this._alpha],
      aColor: [r, g, b, 1]
    });

    this.particles = [
      particle(this.x, this.y, 1, 0, 0),
      particle(this.x + this.w, this.y, 0, 0, 1),
      particle(this.x + this.w, this.y + this.h, 1, 0, 0),
      particle(this.x, this.y + this.h, 0, 1, 0)
    ];

    this.trigger("Invalidate");
    return this;
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
