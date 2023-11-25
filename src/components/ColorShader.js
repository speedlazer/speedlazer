import colorVertexShader from "./shaders/color.vert";
import colorFragmentShader from "./shaders/color.frag";
import Crafty from "../crafty";

Crafty.defaultShader(
  "Color",
  new Crafty.WebGLShader(
    colorVertexShader,
    colorFragmentShader,
    [
      { name: "aPosition", width: 2 },
      { name: "aOrientation", width: 3 },
      { name: "aLayer", width: 2 },
      { name: "aColor", width: 4 },
      { name: "aDesaturation", width: 4 },
      { name: "aGradient", width: 2 }
    ],
    function(e, ent) {
      const color =
        ent.desaturationColor != null
          ? ent.desaturationColor
          : { _red: 0, _green: 0, _blue: 0 };
      e.program.writeVector(
        "aColor",
        ent._red / 255,
        ent._green / 255,
        ent._blue / 255,
        ent._strength
      );
      e.program.writeVector(
        "aDesaturation",
        color._red / 255,
        color._green / 255,
        color._blue / 255,
        1.0
      );
      const s = ent.scale != null ? ent.scale : 1;
      const tds = ent.topDesaturation != null ? ent.topDesaturation : 0;
      const bds = ent.bottomDesaturation != null ? ent.bottomDesaturation : 0;

      return e.program.writeVector(
        "aGradient",
        tds + (1 - s) * 1.15,
        bds + (1 - s) * 1.15
      );
    }
  )
);
