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

