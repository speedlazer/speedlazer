SPRITE_EFFECT_VERTEX_SHADER = """
  attribute vec2 aPosition;
  attribute vec3 aOrientation;
  attribute vec2 aLayer;
  attribute vec2 aTextureCoord;
  attribute vec4 aColor;
  attribute vec3 aGradient;

  varying mediump vec3 vTextureCoord;
  varying lowp vec4 vColor;
  varying lowp vec3 vGradient;

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
  precision mediump float;
  varying mediump vec3 vTextureCoord;
  varying mediump vec4 vColor;
  varying mediump vec3 vGradient;

  uniform sampler2D uSampler;
  uniform mediump vec2 uTextureDimensions;

  float random(vec3 scale, float seed) {
    // use the fragment position for a different seed per-pixel
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
  }

  void main() {
    highp vec2 coord =   vTextureCoord.xy / uTextureDimensions;
    float blur = vGradient.z;

    mediump vec4 texelColor = texture2D(uSampler, coord);

    if (blur > 0.0) {
      vec4 color = vec4(0.0);
      float total = 0.0;

      // randomize the lookup values to hide the fixed number of samples
      float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);

      for (float t = -30.0; t <= 30.0; t++) {
        float percent = (t + offset - 0.5) / 30.0;
        float weight = 1.0 - abs(percent);
        vec4 sample = texture2D(uSampler, coord + (blur * percent) / uTextureDimensions);
        // switch to pre-multiplied alpha to correctly blur transparent images
        sample.rgb *= sample.a;

        color += sample * weight;
        total += weight;
      }

      texelColor = color / total;
      texelColor.rgb /= texelColor.a + 0.00001;
    }

    mediump float mixFactor = (vGradient.x * (1.0 - coord.y)) + (vGradient.y * coord.y);

    mediump float lightness = (0.2126*texelColor.r + 0.7152*texelColor.g + 0.0722*texelColor.b);
    mediump float lightnessBase = (0.2126*vColor.r + 0.7152*vColor.g + 0.0722*vColor.b);
    mediump vec4 baseColor = vec4(vColor.rgb, texelColor.a) * (1.0 + (lightness - lightnessBase));
    mediump vec4 mixColor = vec4(
      (baseColor.rgba * mixFactor) + (texelColor.rgba * (1.0 - mixFactor))
    );

    if (vColor.a > 1.0) {
      mixColor.rgb = vColor.rgb;
    }

    gl_FragColor = vec4(
      mixColor.rgb * vColor.a * texelColor.a * vTextureCoord.z,
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
  { name: "aGradient",     width: 3 }
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
    color = ent.desaturationColor ? { _red: 0, _green: 0, _blue: 0 }
    lightness = ent.lightness ? 1.0
    s = ent.scale ? 1
    blur = ent.blur ? 0
    tds = ent.topDesaturation ? 0
    bds = ent.bottomDesaturation ? 0

    topSaturation = tds + ((1 - s) * 1.15)
    bottomSaturation = bds + ((1 - s) * 1.15)

    if ent.hitFlash
      color = ent.hitFlash
      topSaturation = 3.0
      bottomSaturation = 3.0

    e.program.writeVector("aColor",
      color._red/255,
      color._green/255,
      color._blue/255,
      lightness
    )

    e.program.writeVector("aGradient",
      topSaturation
      bottomSaturation
      blur
    )
)
