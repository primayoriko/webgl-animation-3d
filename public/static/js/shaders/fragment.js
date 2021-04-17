const defaultFS = `
precision mediump float;

varying  vec4 fColor;

void main()
{
    gl_FragColor = fColor;

}
`;

const horseFS = `
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
}
`;

const crocodileFS = `
in vec3 R;
uniform samplerCube texMap;

void main()
{
    vec4 texColor = textureCube(texMap, R); // look up texture map using R
    gl_FragColor = texColor;
}
`;

export { defaultFS, horseFS, crocodileFS };
