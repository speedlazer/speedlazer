SPRITE_EFFECT_VERTEX_SHADER = require('./shaders/sprite.vert')
SPRITE_EFFECT_FRAGMENT_SHADER = require('./shaders/sprite.frag')

SPRITE_EFFECT_ATTRIBUTE_LIST = [
  { name: "aPosition",         width: 2 }
  { name: "aOrientation",      width: 3 }
  { name: "aLayer",            width: 2 }
  { name: "aTextureCoord",     width: 2 }
  { name: "aColor",            width: 4 }
  { name: "aOverrideColor",    width: 4 }
  { name: "aGradient",         width: 4 }
  { name: "aSpriteDimensions", width: 4 }
]

Crafty.defaultShader 'Sprite', new Crafty.WebGLShader(
  SPRITE_EFFECT_VERTEX_SHADER,
  SPRITE_EFFECT_FRAGMENT_SHADER,
  SPRITE_EFFECT_ATTRIBUTE_LIST,
  (e, ent) ->
    co = e.co
    # Write texture coordinates
    e.program.writeVector("aTextureCoord",
      co.x, co.y,
      co.x, co.y + co.h,
      co.x + co.w, co.y,
      co.x + co.w, co.y + co.h
    )
    e.program.writeVector("aSpriteDimensions",
      co.x, co.y,
      co.w, co.h
    )
    color = ent.desaturationColor ? { _red: 0, _green: 0, _blue: 0 }
    ocolor = ent.overrideColor ? { _red: 0, _green: 0, _blue: 0 }
    lightness = ent.lightness ? 1.0
    if ent.hidden
      s = ent.scale ? 1
    else
      s = 1
    blur = ent.blur ? 0
    tds = ent.topDesaturation ? 0
    bds = ent.bottomDesaturation ? 0

    topSaturation = tds + ((1 - s) * 1.15)
    bottomSaturation = bds + ((1 - s) * 1.15)

    if ent.hitFlash
      ocolor = ent.hitFlash
      topSaturation = 0.0
      bottomSaturation = 0.0

    if Game.webGLMode is off
      topSaturation = 0.0
      bottomSaturation = 0.0
      lightness = 1.0 if ent.has('cloud')

    e.program.writeVector("aColor",
      color._red/255,
      color._green/255,
      color._blue/255,
      lightness
    )

    overrideMode = 0.0
    overrideMode = 1.0 if ent.overrideColor?
    overrideMode = 2.0 if ent.overrideColorMode is 'partial'
    overrideMode = 3.0 if ent.hitFlash

    e.program.writeVector("aOverrideColor",
      ocolor._red/255,
      ocolor._green/255,
      ocolor._blue/255,
      overrideMode
    )
    if ent.hideAt
      hideAt = Math.max(0, co.y + ((ent.hideAt - ent.y) / ent.h) * co.h)
    else
      hideAt = -1.0

    e.program.writeVector("aGradient",
      topSaturation
      bottomSaturation
      blur
      hideAt
    )
)

