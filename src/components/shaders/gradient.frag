precision mediump float;
varying lowp vec4 vColor;
varying lowp vec2 vLayer;
void main(void) {
  gl_FragColor = vec4(vColor.rgb*vColor.a*vLayer.y, vColor.a*vLayer.y);
}
