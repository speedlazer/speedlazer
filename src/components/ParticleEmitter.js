import particleVertexShader from "./shaders/particle.vert";
import particleFragmentShader from "./shaders/particle.frag";

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
      e.program.writeVector(
        "aColor",
        entity._red / 255,
        entity._green / 255,
        entity._blue / 255,
        entity._strength
      );
    }
  )
);

const ParticleEmitter = "ParticleEmitter";

Crafty.c(ParticleEmitter, {
  required: "2D, WebGL",
  _red: 0,
  _green: 0,
  _blue: 0,
  _strength: 1.0,
  ready: true,

  init: function() {
    // Necessary for some rendering layers
    this.__coord = this.__coord || [0, 0, 0, 0];

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
    this.unbind("Draw", this._drawColor);
    this.trigger("Invalidate");
  },

  _setupParticles: function(layer) {
    if (layer.type === "WebGL") {
      this._establishShader("Particle", Crafty.defaultShader("Particle"));
    }
  },

  _drawParticles: function(e) {
    e.program.draw(e, this);
  },

  particles: function() {
    this._red = 255;
    this._green = 0;
    this._blue = 0;

    this.trigger("Invalidate");
    return this;
  }
});

export default ParticleEmitter;
