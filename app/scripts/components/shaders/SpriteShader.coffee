SPRITE_EFFECT_VERTEX_SHADER = """
  attribute vec2 aPosition;
  attribute vec4 aSpriteDimensions;
  attribute vec3 aOrientation;
  attribute vec2 aLayer;
  attribute vec2 aTextureCoord;
  attribute vec4 aColor;
  attribute vec4 aOverrideColor;
  attribute vec4 aGradient;

  varying mediump vec3 vTextureCoord;
  varying lowp vec4 vColor;
  varying lowp vec4 vOverrideColor;
  varying lowp vec4 vGradient;
  varying lowp vec4 vSpriteDimensions;

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
    vOverrideColor = aOverrideColor;
    vGradient = aGradient;
    vSpriteDimensions = aSpriteDimensions;
  }
"""

SPRITE_EFFECT_FRAGMENT_SHADER = """
  precision mediump float;
  varying mediump vec3 vTextureCoord;
  varying mediump vec4 vColor;
  varying mediump vec4 vOverrideColor;
  varying mediump vec4 vGradient;
  varying mediump vec4 vSpriteDimensions;

  uniform sampler2D uSampler;
  uniform mediump vec2 uTextureDimensions;

  float random(vec3 scale, float seed) {
    // use the fragment position for a different seed per-pixel
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
  }

  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
    vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
    //vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    //vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    highp vec2 coord =   vTextureCoord.xy / uTextureDimensions;
    float blur = vGradient.z;

    if ((vGradient.a >= 0.0) && (vTextureCoord.y >= vGradient.a)) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

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

    mediump float yCoord = (vTextureCoord.y - vSpriteDimensions.y) / vSpriteDimensions.a;
    mediump float mixFactor = (vGradient.x * (1.0 - yCoord)) + (vGradient.y * yCoord);

    mediump float lightness = (0.2126*texelColor.r + 0.7152*texelColor.g + 0.0722*texelColor.b);
    if (vOverrideColor.a == 1.0) {
      texelColor = vec4(vOverrideColor.rgb * (lightness * 1.3), texelColor.a);
    }
    if (vOverrideColor.a == 2.0) {
      vec3 texelHSV = rgb2hsv(texelColor.rgb);
      if ((texelHSV.x < .84) && (texelHSV.x > .82)) {
        vec3 overrideHSV = rgb2hsv(vOverrideColor.rgb);
        texelHSV.x = overrideHSV.x;
        texelHSV.y *= overrideHSV.y;
        texelHSV.z *= overrideHSV.z;
        vec3 texelRGB = hsv2rgb(texelHSV);
        texelColor = vec4(texelRGB.rgb, texelColor.a);
      }
    }

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

    if window.Game.webGLMode is off
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

