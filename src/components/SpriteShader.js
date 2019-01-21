import spriteVertexShader from "./shaders/sprite.vert";
import spriteFragmentShader from "./shaders/sprite.frag";

const collectHideBelow = entity => {
  if (entity._parent) {
    const result = [];
    if (entity.hideBelow) {
      const hideBelow = entity._parent.y + entity.hideBelow;
      result.push(hideBelow);
    }

    return result.concat(collectHideBelow(entity._parent));
  } else {
    return [];
  }
};

const findHideBelow = entity => {
  const belows = collectHideBelow(entity);
  return belows.length === 0 ? null : Math.max(...belows);
};

Crafty.defaultShader(
  "Sprite",
  new Crafty.WebGLShader(
    spriteVertexShader,
    spriteFragmentShader,
    [
      { name: "aPosition", width: 2 },
      { name: "aOrientation", width: 3 },
      { name: "aLayer", width: 2 },
      { name: "aTextureCoord", width: 2 },
      { name: "aColor", width: 4 },
      { name: "aOverrideColor", width: 4 },
      { name: "aGradient", width: 4 },
      { name: "aSpriteDimensions", width: 4 }
    ],
    function(e, ent) {
      let s;
      const { co } = e;
      // Write texture coordinates
      e.program.writeVector(
        "aTextureCoord",
        co.x,
        co.y,
        co.x,
        co.y + co.h,
        co.x + co.w,
        co.y,
        co.x + co.w,
        co.y + co.h
      );
      e.program.writeVector("aSpriteDimensions", co.x, co.y, co.w, co.h);
      const color =
        ent.desaturationColor != null
          ? ent.desaturationColor
          : { _red: 0, _green: 0, _blue: 0 };
      let ocolor =
        ent.overrideColor != null
          ? ent.overrideColor
          : { _red: 0, _green: 0, _blue: 0 };
      let lightness = ent.lightness != null ? ent.lightness : 1.0;
      if (ent.hidden) {
        s = ent.scale != null ? ent.scale : 1;
      } else {
        s = 1;
      }
      const blur = ent.blur != null ? ent.blur : 0;
      const tds = ent.topDesaturation != null ? ent.topDesaturation : 0;
      const bds = ent.bottomDesaturation != null ? ent.bottomDesaturation : 0;

      let topSaturation = tds + (1 - s) * 1.15;
      let bottomSaturation = bds + (1 - s) * 1.15;

      if (ent.hitFlash) {
        ocolor = ent.hitFlash;
        topSaturation = 0.0;
        bottomSaturation = 0.0;
      }

      if (Game.webGLMode === false) {
        topSaturation = 0.0;
        bottomSaturation = 0.0;
        if (ent.has("cloud")) {
          lightness = 1.0;
        }
      }

      e.program.writeVector(
        "aColor",
        color._red / 255,
        color._green / 255,
        color._blue / 255,
        lightness
      );

      let overrideMode = 0.0;
      if (ent.overrideColor != null) {
        overrideMode = 1.0;
      }
      if (ent.overrideColorMode === "partial") {
        overrideMode = 2.0;
      }
      if (ent.hitFlash) {
        overrideMode = 3.0;
      }

      e.program.writeVector(
        "aOverrideColor",
        ocolor._red / 255,
        ocolor._green / 255,
        ocolor._blue / 255,
        overrideMode
      );

      let hideAt = -1.0;
      if (ent.hideAt) {
        hideAt = Math.max(0, co.y + (ent.hideAt - ent.y) / ent.h * co.h);
      }

      const hideBelow = findHideBelow(ent);
      if (hideBelow !== null) {
        hideAt = Math.max(0, co.y + (hideBelow - ent.y) / ent.h * co.h);
      }

      e.program.writeVector(
        "aGradient",
        topSaturation,
        bottomSaturation,
        blur,
        hideAt
      );
    }
  )
);
