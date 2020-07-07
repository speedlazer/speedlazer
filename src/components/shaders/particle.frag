precision mediump float;
varying lowp vec4 vColor;
varying lowp vec2 vLife;

uniform sampler2D uSampler;
uniform mediump vec2 uTextureDimensions;
uniform highp vec4 uSpriteCoords;

void main(void) {
  if (vLife.x > vLife.y || vLife.x < 0.0) {
    discard;
  }

  if (uSpriteCoords.b == 0.0) {
    gl_FragColor = vColor;
    return;
  }

  highp vec2 coord = (uSpriteCoords.xy + (gl_PointCoord * uSpriteCoords.ba)) / uTextureDimensions;
  mediump vec4 texelColor = texture2D(uSampler, coord);
  mediump float lightness = (0.2126*texelColor.r + 0.7152*texelColor.g + 0.0722*texelColor.b);

  mediump vec3 mixedColor = vColor.rgb * (lightness * 1.3);
  gl_FragColor = vec4(mixedColor * texelColor.a * vColor.a, texelColor.a * vColor.a);
}
