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
varying vec3 fragPos;
varying vec3 lightPos;
varying vec4 vColor;
varying vec3 N;

void main()
{
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = aVertexColor;
  vTextureCoord = aTextureCoord;

  // Apply lighting effect

  N = mat3(uNormalMatrix) * aVertexNormal;
  lightPos = vec3(-20, 0, -5);
  fragPos = vec3(uModelViewMatrix * aVertexPosition);
}
`;

const crocodileVS = `
attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform mat4 u_world;
 
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;
varying vec4 fColor;

varying vec3 tsLightPos;
varying vec3 tsFragPos;

 
void main() {
  // Multiply the position by the matrix.
  gl_Position = projectionMatrix * modelViewMatrix * aVertexPosition;
 
  // send the view position to the fragment shader
  v_worldPosition = (u_world * aVertexPosition).xyz;
 
  // orient the normals and pass to the fragment shader
  v_worldNormal = mat3(u_world) * aVertexNormal;

  vec3 lightPos = vec3(3, 55, 50);
  vec3 N = normalize(mat3(normalMatrix) * aVertexNormal);
  tsLightPos = N * lightPos;
  tsFragPos = N * vec3(modelViewMatrix * aVertexPosition);


  fColor = aVertexColor;

}
`;

const minecraftVS = `
precision highp float;

attribute vec4 vPosition;
attribute vec4 vColor;
attribute vec3 vTang;
attribute vec3 vBitang;
attribute vec2 vTexCoord;


uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

varying vec3 tsLightPos; // Tangent space values
varying vec3 tsViewPos;  //
varying vec3 tsFragPos;  //
varying vec2 fTexCoord;
varying vec4 fColor;

mat3 transpose(in mat3 inMatrix)
{
    vec3 i0 = inMatrix[0];
    vec3 i1 = inMatrix[1];
    vec3 i2 = inMatrix[2];

    mat3 outMatrix = mat3(
        vec3(i0.x, i1.x, i2.x),
        vec3(i0.y, i1.y, i2.y),
        vec3(i0.z, i1.z, i2.z)
    );

    return outMatrix;
}

void main(void)
{
    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
    tsFragPos = vec3(modelViewMatrix * vPosition);
    vec3 vNorm = cross(vBitang, vTang);

    vec3 T = normalize(mat3(normalMatrix) * vTang);
    vec3 B = normalize(mat3(normalMatrix) * vBitang);
    vec3 N = normalize(mat3(normalMatrix) * vNorm);
    mat3 TBN = transpose(mat3(T, B, N));

    vec3 lightPos = vec3(15, 55, 50);
    tsLightPos = TBN * lightPos;
    // Our camera is always at the origin
    tsViewPos = TBN * vec3(0, 0, 0);
    tsFragPos = TBN * tsFragPos;
 
    fTexCoord = vTexCoord;
    fColor = vColor;
}
`;

export { defaultVS, zebraVS, crocodileVS, minecraftVS };
