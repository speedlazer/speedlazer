COLOR_EFFECTS_VERTEX_SHADER = require('./shaders/color.vert')
COLOR_EFFECTS_FRAGMENT_SHADER = require('./shaders/color.frag')

COLOR_EFFECTS_ATTRIBUTE_LIST = [
  { name: "aPosition",     width: 2 }
  { name: "aOrientation",  width: 3 }
  { name: "aLayer",        width: 2 }
  { name: "aColor",        width: 4 }
  { name: "aDesaturation", width: 4 }
  { name: "aGradient",     width: 2 }
]

Crafty.defaultShader 'Color', new Crafty.WebGLShader(
  COLOR_EFFECTS_VERTEX_SHADER,
  COLOR_EFFECTS_FRAGMENT_SHADER,
  COLOR_EFFECTS_ATTRIBUTE_LIST,
  (e, ent) ->
    color = ent.desaturationColor ? { _red: 0, _green: 0, _blue: 0 }
    e.program.writeVector("aColor",
      ent._red/255,
      ent._green/255,
      ent._blue/255,
      ent._strength
    )
    e.program.writeVector("aDesaturation",
      color._red/255,
      color._green/255,
      color._blue/255,
      1.0
    )
    s = ent.scale ? 1
    tds = ent.topDesaturation ? 0
    bds = ent.bottomDesaturation ? 0

    e.program.writeVector("aGradient",
      tds + ((1 - s) * 1.15),
      bds + ((1 - s) * 1.15)
    )
)
