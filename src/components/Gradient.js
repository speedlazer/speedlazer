import gradientVertexShader from "./shaders/gradient.vert";
import gradientFragmentShaders from "./shaders/gradient.frag";

Crafty.extend({
  defaultGradientShader(shader) {
    if (!shader) {
      if (this._defaultGradientShader === undefined) {
        this._defaultGradientShader = new Crafty.WebGLShader(
          gradientVertexShader,
          gradientFragmentShaders,
          [
            { name: "aPosition", width: 2 },
            { name: "aOrientation", width: 3 },
            { name: "aLayer", width: 2 },
            { name: "aColor", width: 4 }
          ],
          function() {}
        );
      }
      return this._defaultGradientShader;
    }
    return (this._defaultGradientShader = shader);
  }
});

const Gradient = "Gradient";

Crafty.c(Gradient, {
  init() {
    // Declaring the vars here instead as class attributes
    // make them unique for each instance
    this._topColor = {
      _red: 0,
      _green: 0,
      _blue: 0,
      _strength: 1.0
    };
    this._bottomColor = {
      _red: 0,
      _green: 0,
      _blue: 0,
      _strength: 1.0
    };
    this.ready = true;

    this.bind("Draw", this._drawGradient);
    if (this.has("WebGL")) {
      this._establishShader("Gradient", Crafty.defaultGradientShader());
    }
    this.trigger("Invalidate");
  },

  remove() {
    this.unbind("Draw", this._drawGradient);
    if (this.has("DOM")) {
      this._element.style.backgroundColor = "transparent";
    }
    this.trigger("Invalidate");
  },

  _drawGradient(e) {
    if (e.type === "webgl") {
      e.program.writeVector(
        "aColor",
        this._topColor._red / 255,
        this._topColor._green / 255,
        this._topColor._blue / 255,
        this._topColor._strength,

        this._bottomColor._red / 255,
        this._bottomColor._green / 255,
        this._bottomColor._blue / 255,
        this._bottomColor._strength
      );
    }
  },

  topColor(color, strength) {
    if (color) {
      this._setColor(this._topColor, color, strength);
      return this;
    }
    return this._topColor;
  },

  bottomColor(color, strength) {
    if (color) {
      this._setColor(this._bottomColor, color, strength);
      return this;
    }
    return this._bottomColor;
  },

  _setColor(varColor, color, strength) {
    if (typeof color === "string") {
      Crafty.assignColor(color, varColor);
    } else {
      varColor._red = color[0];
      varColor._green = color[1];
      varColor._blue = color[2];
    }
    if (strength !== undefined) {
      varColor._strength = strength;
    }
    this.trigger("Invalidate");
  }
});

export default Gradient;
