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
precision mediump float;

varying vec3 R;
uniform samplerCube texMap;

void main()
{
    vec4 texColor = textureCube(texMap, R);

    gl_FragColor = texColor;
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
    vec3 viewDir = normalize(tsViewPos - tsFragPos);

    // Only perturb the texture coordinates if a parallax technique is selected
    vec2 uv = fTexCoord;

    vec3 albedo = vec3(1,1,1);
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
