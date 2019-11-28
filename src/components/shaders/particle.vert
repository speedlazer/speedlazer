attribute vec2 aPosition;
attribute vec2 aVelocity;
attribute vec3 aOrientation;
attribute vec2 aLayer;
attribute vec2 aSize;
attribute vec2 aLife;
attribute vec4 aColor;

varying lowp vec4 vColor;
varying lowp vec2 vLayer;
uniform  vec4 uViewport;
uniform  vec4 uTimeOffset;

mat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);
vec4 viewportTranslation = vec4(uViewport.xy, 0, 0);

void main() {
  vec2 pos = aPosition;
  vec2 entityOrigin = aOrientation.xy;
  mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));

  mat2 entityAngleMatrix = mat2(cos(aVelocity.y), sin(aVelocity.y), -sin(aVelocity.y), cos(aVelocity.y));
  pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin;

  float duration = uTimeOffset.x - aLife.x;
  float dist = aVelocity.x * (duration / 1000.0);

  vec2 movement = vec2(cos(aVelocity.y) * dist, sin(aVelocity.y) * dist);
  pos = pos + movement;

  gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );
	gl_PointSize = aSize.x;

  vColor = aColor;
  vLayer = aLayer;
}


