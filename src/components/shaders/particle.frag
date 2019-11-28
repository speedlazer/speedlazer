precision mediump float;
varying lowp vec4 vColor;
varying lowp vec2 vLife;

void main(void) {
  if (vLife.x > vLife.y) {
    discard;
  }
  gl_FragColor = vColor;
}
