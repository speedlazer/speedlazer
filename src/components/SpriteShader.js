import spriteVertexShader from "./shaders/sprite.vert";
import spriteFragmentShader from "./shaders/sprite.frag";
import Crafty from "../crafty";

const collectHideBelow = entity => {
  if (entity._parent) {
    const result = [];
    if (entity.hideBelow) {
      const hideBelow = entity._parent.y + entity.hideBelow;
      result.push(hideBelow);
    }

    return result.concat(collectHideBelow(entity._parent));
  } else {
    return entity.hideBelow ? [entity.hideBelow] : [];
  }
};

const collectHideAbove = entity => {
  if (entity._parent) {
    const result = [];
    if (entity.hideAbove) {
      const hideAbove = entity._parent.y + entity.hideAbove;
      result.push(hideAbove);
    }

    return result.concat(collectHideAbove(entity._parent));
  } else {
    return entity.hideAbove ? [entity.hideAbove] : [];
  }
};

const findHideBelow = entity => {
  const belows = collectHideBelow(entity);
  return belows.length === 0 ? null : Math.min(...belows);
};

const findHideAbove = entity => {
  const aboves = collectHideAbove(entity);
  return aboves.length === 0 ? null : Math.min(...aboves);
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
      //e.program.max_size = 2000;
      e.program.writeVector(
        "aTextureCoord",
        co.x + 1,
        co.y + 1,
        co.x + 1,
        co.y + co.h - 1,
        co.x + co.w - 1,
        co.y + 1,
        co.x + co.w - 1,
        co.y + co.h - 1
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
      const tds = ent.topDesaturation != null ? ent.topDesaturation : 0;
      const bds = ent.bottomDesaturation != null ? ent.bottomDesaturation : 0;

      let topSaturation = tds + (1 - s) * 1.15;
      let bottomSaturation = bds + (1 - s) * 1.15;

      if (ent.hitFlash) {
        ocolor = ent.hitFlash;
        topSaturation = 0.0;
        bottomSaturation = 0.0;
      }

      e.program.writeVector(
        "aColor",
        color._red,
        color._green,
        color._blue,
        lightness
      );

      let overrideMode = 0.0;
      if (ent.overrideColor != null) {
        overrideMode = 1.0 + ent.overrideColorStrength;
      }
      if (ent.overrideColorMode === "partial") {
        overrideMode = 4.0 + ent.overrideColorStrength;
      }
      if (ent.overrideColorMode === "none") {
        overrideMode = 0.0;
      }
      if (ent.hitFlash) {
        overrideMode = 6.0;
      }

      e.program.writeVector(
        "aOverrideColor",
        ocolor._red,
        ocolor._green,
        ocolor._blue,
        overrideMode
      );

      let hideAt = -1.0;
      if (ent.hideAt) {
        hideAt = Math.max(0, co.y + ((ent.hideAt - ent.y) / ent.h) * co.h);
      }

      const hideBelow = findHideBelow(ent);
      if (hideBelow !== null) {
        hideAt = Math.max(0, co.y + ((hideBelow - ent.y) / ent.h) * co.h);
      }

      let hideTopAt = -1.0;
      const hideAbove = findHideAbove(ent);
      if (hideAbove !== null) {
        hideTopAt = Math.max(0, co.y + ((hideAbove - ent.y) / ent.h) * co.h);
      }

      e.program.writeVector(
        "aGradient",
        topSaturation,
        bottomSaturation,
        hideTopAt,
        hideAt
      );
    }
  )
);
