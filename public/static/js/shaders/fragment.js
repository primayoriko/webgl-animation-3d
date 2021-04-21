const defaultFS = `
precision mediump float;

varying  vec4 fColor;

void main()
{
    gl_FragColor = fColor;

}
`;

const zebraFS = `
precision highp float;

uniform sampler2D uSampler;
uniform bool enableTextureAndShading;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying vec4 vColor;

void main()
{
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    gl_FragColor = enableTextureAndShading? 
        vec4(texelColor.rgb * vLighting, texelColor.a):
        vColor;

    // gl_FragColor =  vec4(texelColor.rgb * vLighting, texelColor.a);
    // gl_FragColor = texture2D(uSampler, vTextureCoord);
    // gl_FragColor =  vColor;
}
`;

const crocodileFS = `
precision highp float;
 
// Passed in from the vertex shader.
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;
 
// The texture.
uniform samplerCube u_texture;
 
// The position of the camera
uniform vec3 u_worldCameraPosition;
 
void main() {
  vec3 worldNormal = normalize(v_worldNormal);
  vec3 eyeToSurfaceDir = normalize(v_worldPosition - u_worldCameraPosition);
  vec3 direction = reflect(eyeToSurfaceDir,worldNormal);
 
  gl_FragColor = textureCube(u_texture, direction);
}
`;

export { defaultFS, zebraFS, crocodileFS };
