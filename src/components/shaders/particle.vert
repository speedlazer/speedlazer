attribute vec3 aPosition;
attribute vec3 aVelocity;
attribute vec3 aOrientation;
attribute vec2 aLayer;
attribute vec2 aSize;
attribute vec4 aLife;
attribute vec4 aColor1;
attribute vec4 aColor2;

varying lowp vec4 vColor;
varying lowp vec2 vLayer;
varying lowp vec3 vLife;

uniform  vec4 uViewport;
uniform  vec4 uTimeOffset;

mat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);
vec4 viewportTranslation = vec4(uViewport.xy, 0, 0);

float gravity(float accelleration, float duration) {
  // https://www.vcalc.com/equation/?uuid=e6ccc22d-da27-11e2-8e97-bc764e04d25f
  return 0.5 * accelleration * (duration / 1000.0) * (duration / 1000.0);
}

void main() {
  vec2 pos = aPosition.xy;
  vec2 entityOrigin = aOrientation.xy;
  mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));

  mat2 entityAngleMatrix = mat2(cos(aVelocity.y), sin(aVelocity.y), -sin(aVelocity.y), cos(aVelocity.y));
  pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin;

  float duration = uTimeOffset.x - aLife.x;
  if (aVelocity.z == -1.0) {
    duration = aLife.y - duration;
  }
  float durationScale = duration / aLife.y;

  float dist = aVelocity.x * (duration / 1000.0);

  vec2 movement = vec2(cos(aVelocity.y) * dist, sin(aVelocity.y) * dist);
  vec2 gravityDisplacement = vec2(gravity(aLife.z, duration), gravity(aLife.a, duration));

  pos = pos + movement + gravityDisplacement;

  gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );
	gl_PointSize = (1.0 - durationScale) * aSize.x + durationScale * aSize.y;

  vColor = mix(aColor1, aColor2, durationScale);
  vLayer = aLayer;
  vLife = vec3(duration, aLife.y, aPosition.z);
}

