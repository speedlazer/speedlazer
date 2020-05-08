precision mediump float;
varying lowp vec4 vColor;
varying lowp vec3 vLife;

uniform sampler2D uSampler;
uniform mediump vec2 uTextureDimensions;
uniform highp mat4 uSpriteMatrix;

void main(void) {
  if (vLife.x > vLife.y || vLife.x < 0.0) {
    discard;
  }

  highp vec4 uSpriteCoords2 = uSpriteMatrix[0];
  if (vLife.z > 0.0 && vLife.z < 2.0) {
    uSpriteCoords2 = uSpriteMatrix[1];
  }
  if (vLife.z > 1.0 && vLife.z < 3.0) {
    uSpriteCoords2 = uSpriteMatrix[2];
  }
  if (vLife.z > 2.0 && vLife.z < 4.0) {
    uSpriteCoords2 = uSpriteMatrix[3];
  }

  if (uSpriteCoords2.b == 0.0) {
    gl_FragColor = vColor;
    return;
  }

  highp vec2 coord = (uSpriteCoords2.xy + (gl_PointCoord * uSpriteCoords2.ba)) / uTextureDimensions;
  mediump vec4 texelColor = texture2D(uSampler, coord);
  mediump float lightness = (0.2126*texelColor.r + 0.7152*texelColor.g + 0.0722*texelColor.b);

  mediump vec3 mixedColor = vColor.rgb * (lightness * 1.3);
  gl_FragColor = vec4(mixedColor * texelColor.a * vColor.a, texelColor.a * vColor.a);
}
