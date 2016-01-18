SPRITE_EFFECT_VERTEX_SHADER = """
  attribute vec2 aPosition;
  attribute vec3 aOrientation;
  attribute vec2 aLayer;
  attribute vec2 aTextureCoord;
  attribute vec4 aColor;
  attribute vec2 aGradient;

  varying mediump vec3 vTextureCoord;
  varying lowp vec4 vColor;
  varying lowp vec2 vGradient;

  uniform vec4 uViewport;
  uniform mediump vec2 uTextureDimensions;

  mat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);
  vec4 viewportTranslation = vec4(uViewport.xy, 0, 0);

  void main() {
    vec2 pos = aPosition;
    vec2 entityOrigin = aOrientation.xy;
    mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));

    pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin ;
    gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );
    vTextureCoord = vec3(aTextureCoord, aLayer.y);
    vColor = aColor;
    vGradient = aGradient;
  }
"""

SPRITE_EFFECT_FRAGMENT_SHADER = """
  varying mediump vec3 vTextureCoord;
  varying mediump vec4 vColor;
  varying mediump vec2 vGradient;

  uniform sampler2D uSampler;
  uniform mediump vec2 uTextureDimensions;

  void main(void) {
    highp vec2 coord =   vTextureCoord.xy / uTextureDimensions;
    mediump vec4 texelColor = texture2D(uSampler, coord);

    mediump float mixFactor = (vGradient.x * (1.0 - coord.y)) + (vGradient.y * coord.y);

    mediump float lightness = (0.2126*texelColor.r + 0.7152*texelColor.g + 0.0722*texelColor.b);
    mediump float lightnessBase = (0.2126*vColor.r + 0.7152*vColor.g + 0.0722*vColor.b);
    mediump vec4 baseColor = vec4(vColor.rgb, texelColor.a) * (1.0 + (lightness - lightnessBase));
    mediump vec4 mixColor = vec4(
      (baseColor.rgba * mixFactor) + (texelColor.rgba * (1.0 - mixFactor))
    );

    gl_FragColor = vec4(
      mixColor.rgb * texelColor.a * vTextureCoord.z,
      texelColor.a * vTextureCoord.z
    );
  }
"""

SPRITE_EFFECT_ATTRIBUTE_LIST = [
  { name: "aPosition",     width: 2 }
  { name: "aOrientation",  width: 3 }
  { name: "aLayer",        width: 2 }
  { name: "aTextureCoord", width: 2 }
  { name: "aColor",        width: 4 }
  { name: "aGradient",     width: 2 }
]

Crafty.defaultSpriteShader new Crafty.WebGLShader(
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
    color = ent.desaturationColor ? { _red: 0, _green: 0, _blue: 0 }
    e.program.writeVector("aColor",
      color._red/255,
      color._green/255,
      color._blue/255,
      1.0
    )
    s = ent.scale ? 1
    e.program.writeVector("aGradient",
      (1 - s) * 1.15,
      (1 - s) * 1.15
    )
)

