COLOR_EFFECTS_VERTEX_SHADER = """
  attribute vec2 aPosition;
  attribute vec3 aOrientation;
  attribute vec2 aLayer;
  attribute vec4 aColor;
  attribute vec4 aDesaturation;
  attribute vec2 aGradient;

  varying lowp vec4 vColor;
  varying lowp vec4 vDesaturation;
  varying lowp vec2 vGradient;
  varying lowp vec2 vLayer;
  uniform  vec4 uViewport;

  mat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);
  vec4 viewportTranslation = vec4(uViewport.xy, 0, 0);

  void main() {
    vec2 pos = aPosition;
    vec2 entityOrigin = aOrientation.xy;
    mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));

    pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin;
    gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );

    vColor = aColor;
    vDesaturation = aDesaturation;
    vGradient = aGradient;
    vLayer = aLayer;
  }
"""

COLOR_EFFECTS_FRAGMENT_SHADER = """
  precision mediump float;
  varying lowp vec4 vColor;
  varying lowp vec2 vGradient;
  varying lowp vec4 vDesaturation;
  varying lowp vec2 vLayer;
  void main(void) {

    //gl_FragColor = vec4(vColor.rgb*vColor.a*vLayer.y, vColor.a*vLayer.y);

    mediump float mixFactor = vGradient.x;

    mediump float lightness = (0.2126*vColor.r + 0.7152*vColor.g + 0.0722*vColor.b);
    mediump float lightnessBase = (0.2126*vDesaturation.r + 0.7152*vDesaturation.g + 0.0722*vDesaturation.b);
    mediump vec4 baseColor = vec4(vDesaturation.rgb, vColor.a) * (1.0 + (lightness - lightnessBase));
    mediump vec4 mixColor = vec4(
      (baseColor.rgba * mixFactor) + (vColor.rgba * (1.0 - mixFactor))
    );

    gl_FragColor = vec4(
      mixColor.rgb * vColor.a * vLayer.y,
      vColor.a * vLayer.y
    );
  }
"""

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
    e.program.writeVector("aDesaturation",
      color._red/255,
      color._green/255,
      color._blue/255,
      1.0
    )
    e.program.writeVector("aColor",
      ent._red/255,
      ent._green/255,
      ent._blue/255,
      ent._strength
    )
    s = ent.scale ? 1
    tds = ent.topDesaturation ? 0
    bds = ent.bottomDesaturation ? 0

    e.program.writeVector("aGradient",
      tds + ((1 - s) * 1.15),
      bds + ((1 - s) * 1.15)
    )
)

Crafty.c 'ColorEffects',

  colorDesaturation: (color) ->
    return this unless color?
    c = {}
    Crafty.assignColor(color, c)
    @attr desaturationColor: c

    @trigger("Invalidate")
    this

  colorOverride: (color) ->
    return this unless color?
    c = {}
    Crafty.assignColor(color, c)
    @attr overrideColor: c

    @trigger("Invalidate")
    this

  saturationGradient: (start, end) ->
    @attr topDesaturation: start, bottomDesaturation: end
    this
