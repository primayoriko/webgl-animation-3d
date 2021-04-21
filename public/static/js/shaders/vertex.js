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

const crocodileVS = `
attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;


uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 u_world;
 
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;
 
void main() {
  // Multiply the position by the matrix.
  gl_Position = uProjectionMatrix * uModelViewMatrix * u_world * aVertexPosition;
 
  // send the view position to the fragment shader
  v_worldPosition = (u_world * aVertexPosition).xyz;
 
  // orient the normals and pass to the fragment shader
  v_worldNormal = mat3(u_world) * aVertexNormal;
}
`;
export { defaultVS, zebraVS, crocodileVS  };
