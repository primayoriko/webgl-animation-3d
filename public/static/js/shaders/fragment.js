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
varying vec4 fColor;

varying vec3 tsLightPos;
 
// The texture.
uniform samplerCube u_texture;
uniform bool enableTextureAndShading;

 
// The position of the camera
uniform vec3 u_worldCameraPosition;
 
void main() {
  vec3 worldNormal = normalize(v_worldNormal);
  vec3 eyeToSurfaceDir = normalize(v_worldPosition - u_worldCameraPosition);
  vec3 direction = reflect(eyeToSurfaceDir,worldNormal);

  vec3 directLight = normalize(tsLightPos);
  vec3 albedo = vec3(0.8,0.8,0.8);
  vec3 ambient = 0.7 * albedo;
  float light = dot(worldNormal, directLight);

  if (!enableTextureAndShading) {
    // No bump mapping
    gl_FragColor = fColor;
  }else{
    gl_FragColor = textureCube(u_texture, direction);
    gl_FragColor.rgb *= (light*albedo + ambient);
  }
}
`;

const minecraftFS = `
precision highp float;

uniform sampler2D texNorm;

uniform bool enableTextureAndShading;

varying vec2 fTexCoord;
varying vec3 tsLightPos;
varying vec3 tsViewPos;
varying vec3 tsFragPos;
varying vec4 fColor;

void main(void)
{
    vec3 lightDir = normalize(tsLightPos - tsFragPos);

    // Only perturb the texture coordinates if a parallax technique is selected
    vec2 uv = fTexCoord;

    vec3 albedo = vec3(0.8,0.8,0.8);
    vec3 ambient = 0.3 * albedo;

    if (!enableTextureAndShading) {
        // No bump mapping
        gl_FragColor = fColor;

    } else {
        // Normal mapping
        vec3 norm = normalize(texture2D(texNorm, uv).rgb * 2.0 - 1.0);
        float diffuse = max(dot(lightDir, norm), 0.0);
        gl_FragColor = vec4(diffuse * albedo + ambient, 1.0);
    }
}
`;

export { defaultFS, zebraFS, crocodileFS, minecraftFS };
