const defaultVS = `
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec4 vPosition;
attribute vec4 vColor;

attribute vec2 vTextCord;

varying vec4 fColor;

void main()
{
  gl_Position = projectionMatrix * modelViewMatrix * vPosition;
  fColor = vColor;
}
`;

const zebraVS = `
uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying vec4 vColor;

void main()
{
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = aVertexColor;
  vTextureCoord = aTextureCoord;

  // Apply lighting effect

  highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
  highp vec3 directionalLightColor = vec3(1, 1, 1);
  highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  vLighting = ambientLight + (directionalLightColor * directional);
}
`;

const crocodileFS = `
out vec3 R;
in vec4 vPosition;
in vec4 Normal;
uniform mat4 ModelView;
uniform mat4 Projection;

void main() {
  gl_Position = Projection * ModelView * vPosition;
  vec4 eyePos = vPosition;
  vec4 NN = ModelView * Normal;
  vec3 N =normalize(NN.xyz);
  R = reflect(eyePos.xyz, N); 
}
`;
export { defaultVS, zebraVS, crocodileFS  };
